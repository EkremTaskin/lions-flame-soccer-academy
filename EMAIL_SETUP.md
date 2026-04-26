# Email Notifications Setup

The site sends production email through a Vercel Serverless Function and Brevo SMTP.

## Architecture

```txt
React app
  -> /api/send-email
  -> Vercel Function
  -> Brevo SMTP
  -> customer/admin inbox
```

Secrets stay on Vercel. Do not add SMTP keys to any `VITE_` variable.

## When Emails Send

- New user registration: sends an email to the new user.
- New booking request: sends an email to the customer and to the academy admin.
- Booking confirmed by admin: sends an email to the customer.

## Vercel Environment Variables

Add these variables in Vercel Project Settings -> Environment Variables:

```txt
BREVO_SMTP_LOGIN=your_brevo_smtp_login
BREVO_SMTP_KEY=your_brevo_smtp_key
MAIL_FROM=verified_sender@yourdomain.com
ADMIN_EMAIL=lionsflamesocceracademy@gmail.com
```

Optional:

```txt
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
```

## Frontend Environment Variables

These are safe public values:

```txt
VITE_SITE_URL=https://lionsflameacademy.com
VITE_EMAIL_API_URL=/api/send-email
```

## Brevo Notes

- `MAIL_FROM` must be a sender verified in Brevo.
- `BREVO_SMTP_KEY` is secret and must only live in Vercel environment variables.
- If a key has been pasted into chat or committed anywhere, revoke it and create a new one.

## Stripe Webhook Environment Variables

Stripe payment verification runs through `/api/stripe-webhook`.

Add these variables in Vercel Project Settings -> Environment Variables:

```txt
STRIPE_SECRET_KEY=sk_live_or_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FIREBASE_SERVICE_ACCOUNT_BASE64=base64_encoded_service_account_json
```

Alternative Firebase Admin variables:

```txt
FIREBASE_PROJECT_ID=socceracademy-75045
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@socceracademy-75045.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Stripe Dashboard webhook URL:

```txt
https://lionsflameacademy.com/api/stripe-webhook
```

Webhook events:

```txt
checkout.session.completed
checkout.session.async_payment_succeeded
checkout.session.expired
```
