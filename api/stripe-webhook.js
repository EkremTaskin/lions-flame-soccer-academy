import Stripe from 'stripe';
import admin from 'firebase-admin';

const BOOKING_STATUSES = {
  paymentSubmitted: 'payment_submitted',
  confirmed: 'confirmed',
  paid: 'paid',
  expired: 'expired',
};

const getRawBody = async (req) => {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
};

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
});

const getFirebaseCredential = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'),
    );
    return admin.credential.cert(serviceAccount);
  }

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
  }

  throw new Error('Firebase Admin credentials are not configured.');
};

const getFirestore = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: getFirebaseCredential(),
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
    });
  }

  return admin.firestore();
};

const updateBookingAfterPaidCheckout = async (session) => {
  const bookingId = session.client_reference_id;

  if (!bookingId) {
    throw new Error(`Stripe session ${session.id} is missing client_reference_id.`);
  }

  if (session.payment_status !== 'paid') {
    return { skipped: true, reason: `payment_status=${session.payment_status}` };
  }

  const db = getFirestore();
  const bookingRef = db.collection('bookings').doc(bookingId);
  const now = new Date().toISOString();

  await db.runTransaction(async (transaction) => {
    const bookingSnapshot = await transaction.get(bookingRef);

    if (!bookingSnapshot.exists) {
      throw new Error(`Booking ${bookingId} was not found.`);
    }

    const booking = bookingSnapshot.data() || {};
    const shouldKeepStatus = [BOOKING_STATUSES.confirmed, BOOKING_STATUSES.paid].includes(booking.status);

    transaction.update(bookingRef, {
      status: shouldKeepStatus ? booking.status : BOOKING_STATUSES.paymentSubmitted,
      paymentStatus: 'paid',
      paymentProvider: 'stripe_payment_link',
      paymentVerifiedAt: now,
      updatedAt: now,
      stripeSessionId: session.id,
      stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
      stripeCustomerEmail: session.customer_details?.email || session.customer_email || null,
      stripeAmountTotal: session.amount_total ?? null,
      stripeCurrency: session.currency ?? null,
    });
  });

  return { skipped: false, bookingId };
};

const expireBookingFromCheckoutSession = async (session) => {
  const bookingId = session.client_reference_id;

  if (!bookingId) {
    return { skipped: true, reason: 'missing client_reference_id' };
  }

  const db = getFirestore();
  const bookingRef = db.collection('bookings').doc(bookingId);
  const now = new Date().toISOString();

  await db.runTransaction(async (transaction) => {
    const bookingSnapshot = await transaction.get(bookingRef);

    if (!bookingSnapshot.exists) {
      return;
    }

    const booking = bookingSnapshot.data() || {};

    if (booking.paymentStatus === 'paid' || [BOOKING_STATUSES.confirmed, BOOKING_STATUSES.paid].includes(booking.status)) {
      return;
    }

    transaction.update(bookingRef, {
      status: BOOKING_STATUSES.expired,
      paymentStatus: 'expired',
      updatedAt: now,
      stripeSessionId: session.id,
    });
  });

  return { skipped: false, bookingId };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!process.env.STRIPE_SECRET_KEY || !webhookSecret) {
      return res.status(500).json({ error: 'Stripe webhook environment is not configured.' });
    }

    const rawBody = await getRawBody(req);
    const event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const result = await updateBookingAfterPaidCheckout(event.data.object);
      return res.status(200).json({ received: true, event: event.type, ...result });
    }

    if (event.type === 'checkout.session.expired') {
      const result = await expireBookingFromCheckoutSession(event.data.object);
      return res.status(200).json({ received: true, event: event.type, ...result });
    }

    return res.status(200).json({ received: true, ignored: true, event: event.type });
  } catch (error) {
    console.error('stripe-webhook failed:', error);
    return res.status(400).json({ error: 'Webhook could not be processed.' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
