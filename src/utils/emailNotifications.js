const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://lionsflameacademy.com';
const EMAIL_API_URL = import.meta.env.VITE_EMAIL_API_URL || '/api/send-email';

const formatMoney = (amount) => {
  const numberAmount = Number(amount);
  return Number.isFinite(numberAmount) ? `$${numberAmount}.00` : '-';
};

const getBookingEmailParams = (booking = {}) => {
  const customerDetails = booking.customerDetails ?? {};

  return {
    bookingId: booking.id ?? booking.bookingId ?? '',
    userEmail: booking.userEmail ?? '',
    playerName: customerDetails.playerName ?? '',
    playerAge: customerDetails.playerAge ?? '',
    parentName: customerDetails.parentName ?? '',
    parentPhone: customerDetails.parentPhone ?? '',
    notes: customerDetails.notes ?? '',
    program: booking.program ?? '',
    date: booking.date ?? '',
    time: booking.time ?? '',
    duration: booking.duration ? `${booking.duration} minutes` : '',
    amount: formatMoney(booking.amount ?? booking.price),
    status: booking.status ?? '',
    siteUrl: SITE_URL,
    accountUrl: `${SITE_URL}/account`,
    adminUrl: `${SITE_URL}/admin`,
  };
};

async function sendEmailEvent(event, payload) {
  const response = await fetch(EMAIL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ event, payload }),
  });

  if (!response.ok) {
    throw new Error(`Email endpoint failed with status ${response.status}`);
  }

  return response.json().catch(() => ({ ok: true }));
}

async function sendEmailSafely(event, payload, label) {
  try {
    return await sendEmailEvent(event, payload);
  } catch (error) {
    console.error(`Failed to send ${label} email:`, error);
    return { failed: true };
  }
}

export function notifyRegistration({ email }) {
  return sendEmailSafely(
    'registration',
    {
      userEmail: email,
      siteUrl: SITE_URL,
      loginUrl: `${SITE_URL}/login`,
      accountUrl: `${SITE_URL}/account`,
    },
    'registration',
  );
}

export function notifyBookingCreated(booking) {
  return sendEmailSafely(
    'booking_created',
    getBookingEmailParams(booking),
    'booking created',
  );
}

export function notifyBookingConfirmed(booking) {
  return sendEmailSafely(
    'booking_confirmed',
    getBookingEmailParams(booking),
    'booking confirmed',
  );
}

