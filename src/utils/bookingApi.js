import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import { getAvailableSlots } from '../../shared/bookingConfig';

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

export const createCheckoutSession = async (payload) => {
  if (!functions) {
    throw new Error('Firebase Functions is not initialized.');
  }

  const createSession = httpsCallable(functions, 'createCheckoutSession');
  const response = await createSession(payload);
  return response.data;
};

export const getCheckoutSessionStatus = async (sessionId) => {
  if (!functions) {
    throw new Error('Firebase Functions is not initialized.');
  }

  const getStatus = httpsCallable(functions, 'getCheckoutSessionStatus');
  const response = await getStatus({ sessionId });
  return response.data;
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
