const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

const EMAIL_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL,
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://lionsflameacademy.com',
  templates: {
    registration: import.meta.env.VITE_EMAILJS_TEMPLATE_REGISTRATION,
    bookingCustomer: import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING_CUSTOMER,
    bookingAdmin: import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING_ADMIN,
    bookingConfirmed: import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING_CONFIRMED,
  },
};

const isEmailEnabled = (templateId) => (
  Boolean(EMAIL_CONFIG.serviceId && EMAIL_CONFIG.publicKey && templateId)
);

const formatMoney = (amount) => {
  const numberAmount = Number(amount);
  return Number.isFinite(numberAmount) ? `$${numberAmount}.00` : '-';
};

const getBookingEmailParams = (booking = {}) => {
  const customerDetails = booking.customerDetails ?? {};

  return {
    booking_id: booking.id ?? booking.bookingId ?? '',
    site_url: EMAIL_CONFIG.siteUrl,
    login_url: `${EMAIL_CONFIG.siteUrl}/login`,
    account_url: `${EMAIL_CONFIG.siteUrl}/account`,
    admin_url: `${EMAIL_CONFIG.siteUrl}/admin`,
    admin_email: EMAIL_CONFIG.adminEmail ?? '',
    user_email: booking.userEmail ?? '',
    to_email: booking.userEmail ?? '',
    player_name: customerDetails.playerName ?? '',
    player_age: customerDetails.playerAge ?? '',
    parent_name: customerDetails.parentName ?? '',
    parent_phone: customerDetails.parentPhone ?? '',
    notes: customerDetails.notes ?? '',
    program: booking.program ?? '',
    date: booking.date ?? '',
    time: booking.time ?? '',
    duration: booking.duration ? `${booking.duration} minutes` : '',
    amount: formatMoney(booking.amount ?? booking.price),
    status: booking.status ?? '',
  };
};

async function sendEmail(templateId, templateParams) {
  if (!isEmailEnabled(templateId)) {
    console.info('Email notification skipped. EmailJS env vars are not configured.');
    return { skipped: true };
  }

  const response = await fetch(EMAILJS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: EMAIL_CONFIG.serviceId,
      template_id: templateId,
      user_id: EMAIL_CONFIG.publicKey,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    throw new Error(`EmailJS request failed with status ${response.status}`);
  }

  return { skipped: false };
}

async function sendEmailSafely(templateId, templateParams, label) {
  try {
    return await sendEmail(templateId, templateParams);
  } catch (error) {
    console.error(`Failed to send ${label} email:`, error);
    return { skipped: false, failed: true };
  }
}

export function notifyRegistration({ email }) {
  return sendEmailSafely(
    EMAIL_CONFIG.templates.registration,
    {
      to_email: email,
      user_email: email,
      site_url: EMAIL_CONFIG.siteUrl,
      login_url: `${EMAIL_CONFIG.siteUrl}/login`,
    },
    'registration',
  );
}

export function notifyBookingCreated(booking) {
  const params = getBookingEmailParams(booking);

  return Promise.allSettled([
    sendEmailSafely(EMAIL_CONFIG.templates.bookingCustomer, params, 'booking customer'),
    sendEmailSafely(
      EMAIL_CONFIG.templates.bookingAdmin,
      {
        ...params,
        to_email: EMAIL_CONFIG.adminEmail,
      },
      'booking admin',
    ),
  ]);
}

export function notifyBookingConfirmed(booking) {
  return sendEmailSafely(
    EMAIL_CONFIG.templates.bookingConfirmed,
    getBookingEmailParams(booking),
    'booking confirmed',
  );
}

