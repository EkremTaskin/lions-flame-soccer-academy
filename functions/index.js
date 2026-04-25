import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { defineSecret } from 'firebase-functions/params';
import { HttpsError, onCall, onRequest } from 'firebase-functions/v2/https';
import Stripe from 'stripe';
import {
  ACTIVE_BOOKING_WINDOW_MINUTES,
  BOOKING_STATUSES,
  buildBookingRecord,
  getAvailableSlots,
  getBookingPrice,
} from './bookingConfig.js';

initializeApp();

const db = getFirestore();
const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');
const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');
const callableFunctionOptions = {
  region: 'us-central1',
  cors: true,
  secrets: [stripeSecretKey],
};

function getStripeClient() {
  return new Stripe(stripeSecretKey.value());
}

function normalizeBasePath(basePath = '/') {
  if (!basePath || basePath === '/') {
    return '/';
  }

  return `/${basePath.replace(/^\/+|\/+$/g, '')}/`;
}

function buildRedirectUrl(origin, basePath, queryParams = {}) {
  const url = new URL(`book`, new URL(normalizeBasePath(basePath), origin));

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function getBookingsForDate(date) {
  const snapshot = await db.collection('bookings').where('date', '==', date).get();
  return snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }));
}

async function markBookingPaid(bookingId, session) {
  const bookingRef = db.collection('bookings').doc(bookingId);
  const update = {
    status: BOOKING_STATUSES.paid,
    paymentStatus: 'paid',
    expiresAt: null,
    paidAt: new Date().toISOString(),
    stripeSessionId: session.id,
    stripePaymentIntentId: session.payment_intent ?? null,
    stripeCustomerId: session.customer ?? null,
    updatedAt: new Date().toISOString(),
  };

  if (session.amount_total) {
    update.amount = Math.round(session.amount_total / 100);
  }

  await bookingRef.set(update, { merge: true });
}

export const createCheckoutSession = onCall(
  callableFunctionOptions,
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'You must be logged in to book a session.');
    }

    const { program, duration, date, time, origin, basePath } = request.data ?? {};

    if (!program || !duration || !date || !time || !origin) {
      throw new HttpsError('invalid-argument', 'Missing required booking details.');
    }

    let amount;

    try {
      amount = getBookingPrice(program, duration);
    } catch (error) {
      throw new HttpsError('invalid-argument', error.message);
    }

    const existingBookings = await getBookingsForDate(date);
    const availableSlots = getAvailableSlots(date, duration, existingBookings);

    if (!availableSlots.includes(time)) {
      throw new HttpsError('failed-precondition', 'This slot is no longer available.');
    }

    const expiresAt = new Date(Date.now() + (ACTIVE_BOOKING_WINDOW_MINUTES * 60 * 1000)).toISOString();
    const bookingRecord = buildBookingRecord({
      program,
      duration,
      date,
      time,
      amount,
      userId: request.auth.uid,
      userEmail: request.auth.token.email ?? '',
      status: BOOKING_STATUSES.pending,
      expiresAt,
    });

    const bookingRef = await db.collection('bookings').add({
      ...bookingRecord,
      updatedAt: new Date().toISOString(),
    });

    try {
      const stripe = getStripeClient();
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: request.auth.token.email,
        success_url: buildRedirectUrl(origin, basePath, {
          checkout: 'success',
          session_id: '{CHECKOUT_SESSION_ID}',
        }),
        cancel_url: buildRedirectUrl(origin, basePath, {
          checkout: 'cancel',
          program,
          duration,
          date,
          time,
        }),
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'usd',
              unit_amount: amount * 100,
              product_data: {
                name: `${program} Training Session`,
                description: `${duration} minutes on ${date} at ${time}`,
              },
            },
          },
        ],
        metadata: {
          bookingId: bookingRef.id,
          userId: request.auth.uid,
          program,
          duration: String(duration),
          date,
          time,
          amount: String(amount),
        },
        expires_at: Math.floor(new Date(expiresAt).getTime() / 1000),
      });

      await bookingRef.set(
        {
          stripeSessionId: session.id,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );

      return {
        bookingId: bookingRef.id,
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      await bookingRef.set(
        {
          status: BOOKING_STATUSES.cancelled,
          paymentStatus: 'failed',
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );

      console.error('Stripe session creation failed', error);
      throw new HttpsError('internal', 'Stripe checkout session could not be created.');
    }
  },
);

export const getCheckoutSessionStatus = onCall(
  callableFunctionOptions,
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'You must be logged in to check payment status.');
    }

    const sessionId = request.data?.sessionId;

    if (!sessionId) {
      throw new HttpsError('invalid-argument', 'Missing Stripe session id.');
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.metadata?.userId !== request.auth.uid) {
      throw new HttpsError('permission-denied', 'You cannot access this checkout session.');
    }

    const bookingId = session.metadata?.bookingId;
    let booking = null;

    if (bookingId) {
      const bookingRef = db.collection('bookings').doc(bookingId);
      const bookingSnapshot = await bookingRef.get();
      booking = bookingSnapshot.exists ? { id: bookingSnapshot.id, ...bookingSnapshot.data() } : null;

      if (session.payment_status === 'paid' && booking && booking.status !== BOOKING_STATUSES.paid) {
        await markBookingPaid(bookingId, session);
        const updatedSnapshot = await bookingRef.get();
        booking = { id: updatedSnapshot.id, ...updatedSnapshot.data() };
      }
    }

    return {
      sessionId: session.id,
      paymentStatus: session.payment_status,
      status: session.status,
      booking,
    };
  },
);

export const stripeWebhook = onRequest(
  { region: 'us-central1', secrets: [stripeSecretKey, stripeWebhookSecret] },
  async (request, response) => {
    if (request.method !== 'POST') {
      response.status(405).send('Method Not Allowed');
      return;
    }

    const signature = request.headers['stripe-signature'];

    if (!signature) {
      response.status(400).send('Missing Stripe signature');
      return;
    }

    const stripe = getStripeClient();

    let event;
    try {
      event = stripe.webhooks.constructEvent(request.rawBody, signature, stripeWebhookSecret.value());
    } catch (error) {
      response.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (bookingId && session.payment_status === 'paid') {
          await markBookingPaid(bookingId, session);
        }
      }

      if (event.type === 'checkout.session.expired') {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (bookingId) {
          await db.collection('bookings').doc(bookingId).set(
            {
              status: BOOKING_STATUSES.expired,
              paymentStatus: 'expired',
              updatedAt: new Date().toISOString(),
            },
            { merge: true },
          );
        }
      }

      response.json({ received: true });
    } catch (error) {
      console.error('Stripe webhook handling error', error);
      response.status(500).send('Webhook processing failed');
    }
  },
);
