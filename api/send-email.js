import nodemailer from 'nodemailer';

const ALLOWED_ORIGINS = new Set([
  'https://lionsflameacademy.com',
  'https://www.lionsflameacademy.com',
  'http://localhost:5173',
]);

const ACADEMY_NAME = "Lion's Flame Soccer Academy";

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const getCorsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://lionsflameacademy.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
});

const sendJson = (res, status, body, origin) => {
  Object.entries(getCorsHeaders(origin)).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  res.status(status).json(body);
};

const getRequiredEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const getTransporter = () => nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
  port: Number(process.env.BREVO_SMTP_PORT || 587),
  secure: false,
  auth: {
    user: getRequiredEnv('BREVO_SMTP_LOGIN'),
    pass: getRequiredEnv('BREVO_SMTP_KEY'),
  },
});

const renderLayout = ({ title, intro, rows = [], actionUrl, actionLabel }) => {
  const rowHtml = rows
    .filter((row) => row.value)
    .map((row) => `
      <tr>
        <td style="padding:8px 0;color:#6b7280;font-size:14px;">${escapeHtml(row.label)}</td>
        <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:700;text-align:right;">${escapeHtml(row.value)}</td>
      </tr>
    `)
    .join('');

  const actionHtml = actionUrl && actionLabel
    ? `<p style="margin:26px 0 0;"><a href="${escapeHtml(actionUrl)}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:800;">${escapeHtml(actionLabel)}</a></p>`
    : '';

  return `
    <div style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;color:#111827;">
      <div style="max-width:620px;margin:0 auto;padding:32px 18px;">
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:26px;">
          <p style="margin:0 0 10px;color:#9a7a16;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">${ACADEMY_NAME}</p>
          <h1 style="margin:0 0 12px;color:#111111;font-size:26px;line-height:1.1;">${escapeHtml(title)}</h1>
          <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.6;">${escapeHtml(intro)}</p>
          ${rowHtml ? `<table style="width:100%;border-top:1px solid #eef0f3;border-bottom:1px solid #eef0f3;border-collapse:collapse;">${rowHtml}</table>` : ''}
          ${actionHtml}
        </div>
        <p style="margin:16px 0 0;text-align:center;color:#7b8491;font-size:12px;">This is an automated notification from ${ACADEMY_NAME}.</p>
      </div>
    </div>
  `;
};

const bookingRows = (payload) => [
  { label: 'Program', value: payload.program },
  { label: 'Player', value: payload.playerName },
  { label: 'Age', value: payload.playerAge },
  { label: 'Parent', value: payload.parentName },
  { label: 'Phone', value: payload.parentPhone },
  { label: 'Date', value: payload.date },
  { label: 'Time', value: payload.time },
  { label: 'Duration', value: payload.duration },
  { label: 'Price', value: payload.amount },
  { label: 'Booking ID', value: payload.bookingId },
];

const buildMessages = ({ event, payload }) => {
  const fromEmail = getRequiredEnv('MAIL_FROM');
  const adminEmail = getRequiredEnv('ADMIN_EMAIL');
  const from = `${ACADEMY_NAME} <${fromEmail}>`;

  if (event === 'registration') {
    return [{
      from,
      to: payload.userEmail,
      subject: `Welcome to ${ACADEMY_NAME}`,
      html: renderLayout({
        title: 'Welcome to your academy account',
        intro: 'Your account has been created. You can now book sessions and track appointment updates from your account dashboard.',
        rows: [{ label: 'Email', value: payload.userEmail }],
        actionUrl: payload.accountUrl,
        actionLabel: 'Open My Account',
      }),
    }];
  }

  if (event === 'booking_created') {
    return [
      {
        from,
        to: payload.userEmail,
        subject: 'Your booking request was received',
        html: renderLayout({
          title: 'Booking request received',
          intro: 'We received your booking request. After payment and review, the academy will confirm your appointment.',
          rows: bookingRows(payload),
          actionUrl: payload.accountUrl,
          actionLabel: 'View Booking',
        }),
      },
      {
        from,
        to: adminEmail,
        subject: `New booking request: ${payload.program || 'Session'}`,
        html: renderLayout({
          title: 'New appointment request',
          intro: 'A customer created a new booking request. Review the appointment in the admin panel and confirm it after payment review.',
          rows: [
            { label: 'Customer Email', value: payload.userEmail },
            ...bookingRows(payload),
            { label: 'Notes', value: payload.notes },
          ],
          actionUrl: payload.adminUrl,
          actionLabel: 'Open Admin Panel',
        }),
      },
    ];
  }

  if (event === 'booking_confirmed') {
    return [{
      from,
      to: payload.userEmail,
      subject: 'Your soccer session is confirmed',
      html: renderLayout({
        title: 'Appointment confirmed',
        intro: 'Your training session has been confirmed. Please arrive prepared with cleats, shin guards, water, and weather-appropriate athletic clothing.',
        rows: bookingRows(payload),
        actionUrl: payload.accountUrl,
        actionLabel: 'View My Booking',
      }),
    }];
  }

  return [];
};

export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (req.method === 'OPTIONS') {
    Object.entries(getCorsHeaders(origin)).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' }, origin);
  }

  try {
    const { event, payload = {} } = req.body || {};
    const messages = buildMessages({ event, payload });

    if (messages.length === 0) {
      return sendJson(res, 400, { error: 'Unknown email event' }, origin);
    }

    const transporter = getTransporter();
    const results = [];

    for (const message of messages) {
      if (!message.to) {
        continue;
      }
      results.push(await transporter.sendMail(message));
    }

    return sendJson(res, 200, { ok: true, sent: results.length }, origin);
  } catch (error) {
    console.error('send-email failed:', error);
    return sendJson(res, 500, { error: 'Email could not be sent' }, origin);
  }
}

