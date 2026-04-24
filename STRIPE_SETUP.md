# Stripe Checkout + Firebase Functions Setup

This project now uses Stripe Checkout for session bookings.

## What was added

- `src/pages/BookingPage.jsx`: redirects users to Stripe Checkout instead of collecting card data locally.
- `src/utils/bookingApi.js`: loads slots from Firestore and calls Firebase Functions.
- `functions/index.js`: creates Checkout Sessions, verifies session status, and handles Stripe webhooks.
- `shared/bookingConfig.js`: shared slot and pricing rules for the frontend.

## Required secrets

Set these Firebase Functions secrets before deployment:

```bash
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
```

## Local Stripe webhook forwarding

After starting Firebase emulators or deploying the function, forward Stripe events:

```bash
stripe listen --forward-to http://127.0.0.1:5001/socceracademy-75045/us-central1/stripeWebhook
```

For production, copy the webhook signing secret from Stripe into `STRIPE_WEBHOOK_SECRET`.

## Deploy

Install functions dependencies once:

```bash
cd functions
npm install
```

Deploy functions:

```bash
firebase deploy --only functions
```

## Stripe dashboard webhook events

Subscribe at minimum to:

- `checkout.session.completed`
- `checkout.session.expired`

## Booking flow

1. User selects program, duration, date, and time.
2. Frontend calls `createCheckoutSession`.
3. Function re-checks price and slot availability.
4. A pending booking is stored for 15 minutes.
5. Stripe Checkout collects payment.
6. Webhook marks the booking as `paid`.
