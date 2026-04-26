# Email Notifications Setup

The site can send email notifications through EmailJS without adding a backend.

## When Emails Send

- New user registration: sends an email to the new user.
- New booking request: sends an email to the customer and to the academy admin.
- Booking confirmed by admin: sends an email to the customer.

## Required EmailJS Templates

Create four templates in EmailJS:

- `registration`
- `booking customer`
- `booking admin`
- `booking confirmed`

Each template should use `{{to_email}}` as the recipient email. Useful template variables:

- `{{user_email}}`
- `{{admin_email}}`
- `{{player_name}}`
- `{{player_age}}`
- `{{parent_name}}`
- `{{parent_phone}}`
- `{{program}}`
- `{{date}}`
- `{{time}}`
- `{{duration}}`
- `{{amount}}`
- `{{status}}`
- `{{booking_id}}`
- `{{account_url}}`
- `{{admin_url}}`
- `{{site_url}}`

## Environment Variables

Add these to `.env.local` before building and deploying:

```txt
VITE_SITE_URL=https://lionsflameacademy.com
VITE_ADMIN_EMAIL=lionsflamesocceracademy@gmail.com

VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_TEMPLATE_REGISTRATION=your_registration_template_id
VITE_EMAILJS_TEMPLATE_BOOKING_CUSTOMER=your_booking_customer_template_id
VITE_EMAILJS_TEMPLATE_BOOKING_ADMIN=your_booking_admin_template_id
VITE_EMAILJS_TEMPLATE_BOOKING_CONFIRMED=your_booking_confirmed_template_id
```

If these values are missing, the site skips emails and continues working normally.
