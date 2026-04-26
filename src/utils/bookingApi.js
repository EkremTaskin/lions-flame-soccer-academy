import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import {
  ACTIVE_BOOKING_WINDOW_MINUTES,
  BOOKING_STATUSES,
  buildBookingRecord,
  getAvailableSlots,
  getBookingPrice,
} from '../../shared/bookingConfig';

const PAYMENT_LINKS = {
  'One-on-One': {
    45: import.meta.env.VITE_STRIPE_PAYMENT_LINK_ONE_ON_ONE_45,
    90: import.meta.env.VITE_STRIPE_PAYMENT_LINK_ONE_ON_ONE_90,
  },
  'Small Group': {
    45: import.meta.env.VITE_STRIPE_PAYMENT_LINK_SMALL_GROUP_45,
    90: import.meta.env.VITE_STRIPE_PAYMENT_LINK_SMALL_GROUP_90,
  },
  'Large Group': {
    45: import.meta.env.VITE_STRIPE_PAYMENT_LINK_LARGE_GROUP_45,
    90: import.meta.env.VITE_STRIPE_PAYMENT_LINK_LARGE_GROUP_90,
  },
};

const normalizeProgramKey = (programName = '') => programName
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const PROGRAM_NAME_ALIASES = {
  'one on one': 'One-on-One',
  'one on one training': 'One-on-One',
  'small group': 'Small Group',
  'small group training': 'Small Group',
  'large group': 'Large Group',
  'large group training': 'Large Group',
};

const getPaymentLink = (program, duration) => {
  const durationMinutes = Number(duration);
  const canonicalProgram = PROGRAM_NAME_ALIASES[normalizeProgramKey(program)] ?? program?.trim();

  return {
    canonicalProgram,
    durationMinutes,
    paymentLink: PAYMENT_LINKS[canonicalProgram]?.[durationMinutes],
  };
};

export const fetchAvailableSlots = async (dateStr, duration) => {
  if (!dateStr) {
    return [];
  }

  if (!db) {
    console.warn('Firebase is not initialized. Falling back to mock slots.');
    return getAvailableSlots(dateStr, duration);
  }

  try {
    const bookingsQuery = query(collection(db, 'bookings'), where('date', '==', dateStr));
    const querySnapshot = await getDocs(bookingsQuery);
    const bookings = querySnapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...docSnapshot.data(),
    }));

    return getAvailableSlots(dateStr, duration, bookings);
  } catch (error) {
    console.error('Error fetching slots from Firebase:', error);
    return getAvailableSlots(dateStr, duration);
  }
};

export const createPaymentLinkBooking = async ({ program, duration, date, time, user, customerDetails }) => {
  const { canonicalProgram, durationMinutes, paymentLink } = getPaymentLink(program, duration);

  if (!paymentLink) {
    throw new Error(`Stripe Payment Link is missing for ${canonicalProgram || program || 'selected program'} ${durationMinutes || duration} minutes. Please refresh the page and try again.`);
  }

  if (!db) {
    throw new Error('Firebase is not initialized.');
  }

  if (!user) {
    throw new Error('You must be logged in to book a session.');
  }

  const existingBookings = await getDocs(query(collection(db, 'bookings'), where('date', '==', date)));
  const bookings = existingBookings.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  }));
  const availableSlots = getAvailableSlots(date, duration, bookings);

  if (!availableSlots.includes(time)) {
    throw new Error('This slot is no longer available.');
  }

  const amount = getBookingPrice(canonicalProgram, duration);
  const expiresAt = new Date(Date.now() + (ACTIVE_BOOKING_WINDOW_MINUTES * 60 * 1000)).toISOString();
  const bookingRecord = buildBookingRecord({
    program: canonicalProgram,
    duration,
    date,
    time,
    amount,
    userId: user.uid,
    userEmail: user.email ?? '',
    status: BOOKING_STATUSES.pending,
    expiresAt,
  });

  const bookingRef = await addDoc(collection(db, 'bookings'), {
    ...bookingRecord,
    customerDetails: {
      playerName: customerDetails?.playerName ?? '',
      playerAge: customerDetails?.playerAge ?? '',
      parentName: customerDetails?.parentName ?? '',
      parentPhone: customerDetails?.parentPhone ?? '',
      notes: customerDetails?.notes ?? '',
    },
    paymentProvider: 'stripe_payment_link',
    updatedAt: new Date().toISOString(),
  });

  const checkoutUrl = new URL(paymentLink);
  checkoutUrl.searchParams.set('client_reference_id', bookingRef.id);

  if (user.email) {
    checkoutUrl.searchParams.set('prefilled_email', user.email);
  }

  return {
    bookingId: bookingRef.id,
    program: canonicalProgram,
    duration: String(durationMinutes),
    url: checkoutUrl.toString(),
  };
};

export const submitContactForm = async (formData) => {
  if (!db) {
    console.warn('Firebase is not initialized. Falling back to mock.');
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
  }

  try {
    await addDoc(collection(db, 'contacts'), {
      ...formData,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding contact form:', error);
    throw error;
  }
};
