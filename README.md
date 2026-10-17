# StartUpMain

Startup Cafe project containing client (React/Vite) and server (Node/Express).

## Running the applications

The repository contains three independently built applications:

- Public website: `cd client && npm install && npm run dev` (Vite port 5173).
- Admin panel: `cd admin && npm install && npm run dev` (Vite port 5174).
- API: `cd server && npm install && npm run dev` (Express port 5000).

Use Node.js 20.19+ (or 22.12+) for the Vite 8 admin build; the backend's
Nodemailer version requires Node.js 20 or newer.

Copy `server/.env.example` to `server/.env`. The server and admin creation /
email-diagnostic scripts load that file by its path, so they work whether
commands run from the repository root or the `server` folder.

Backend settings:

- `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and `PORT` configure the existing
  MongoDB, JWT, initial admin, and API server.
- `ADMIN_URL` is the public admin-panel base URL used in password-reset and
  email-change verification links. It is also allowed by API CORS.
- `CLIENT_URL` is a comma-separated list of public website origins allowed by
  API CORS.
- `GMAIL_USER` and `GMAIL_APP_PASSWORD` configure Gmail SMTP. Use a Google
  account with 2-Step Verification and a Google app password; do not use the
  account's regular password.
- `NOTIFICATION_EMAIL` is the required recipient for new lead notifications.

For production, set `ADMIN_URL` and `CLIENT_URL` to the deployed HTTPS origins.
Set the admin build's `VITE_API_URL` to the API origin (without `/api`). For the
public client, set `VITE_API_URL` to the API origin and `VITE_API_BASE_URL` to
the API origin with `/api` appended. These variables are build-time frontend
URLs, not secrets. Never put MongoDB, JWT, or Gmail credentials in frontend
environment variables.

Run `cd server && npm run email:verify` to verify Gmail SMTP authentication and
connectivity without sending a message. Diagnostics log only SMTP error codes,
protocol command/response codes, and remediation steps—not credentials,
recipient addresses, reset tokens, or raw provider responses.

## Admin authentication and account recovery

Password-reset and email-change verification links expire after 30 minutes and
can only be used once; MongoDB stores only their SHA-256 hashes. Completing
either flow invalidates existing JWT sessions. Sensitive authentication
endpoints have per-IP rate limits (the default store is process-local; use a
shared `express-rate-limit` store for multiple API instances).

- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `PATCH /api/auth/profile/email` (authenticated; requires current password)
- `POST /api/auth/profile/email/confirm`

CMS writes and image uploads require an authenticated admin session. Public
website visitors can still read CMS content and submit booking inquiries.
