import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

const SESSION_KEY = 'lionsFlameAnalyticsSessionId';

const getSessionId = () => {
  if (typeof window === 'undefined') {
    return 'server';
  }

  const existingId = window.localStorage.getItem(SESSION_KEY);

  if (existingId) {
    return existingId;
  }

  const newId = window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  window.localStorage.setItem(SESSION_KEY, newId);
  return newId;
};

export const trackSiteEvent = async (eventName, metadata = {}) => {
  if (!db) {
    return;
  }

  try {
    await addDoc(collection(db, 'analyticsEvents'), {
      eventName,
      metadata,
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      sessionId: getSessionId(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Analytics event could not be saved:', error);
  }
};
