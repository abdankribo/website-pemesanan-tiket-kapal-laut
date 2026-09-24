# Website Pemesanan Tiket Kapal Laut

Next.js 16 + TypeScript + Tailwind CSS + Prisma PostgreSQL application for ticket booking.

## Local development

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to a PostgreSQL connection string.
3. Set `AUTH_SECRET` to a random value of at least 32 characters.
4. Install dependencies:

```bash
npm install
```

5. Apply migrations:

```bash
npx prisma migrate deploy
```

6. Start development:

```bash
npm run dev
```

## CI validation

The GitHub Actions workflow validates:

- PostgreSQL migrations
- ESLint
- production build
- production server startup and health endpoint
- same-origin protection for protected POST endpoints
- register/logout/login with remember-me
- search
- motor booking
- booking draft
- payment completion
- ticket ownership page
- public QR ticket verification
- My Tickets

The CI workflow currently uses `npm install` because this repository does not commit a `package-lock.json`.

## Production database

For a pooled PostgreSQL provider, use:

- `DATABASE_URL`: pooled/runtime connection
- `DIRECT_URL`: direct connection for Prisma migrations and administration

The runtime client reads `DATABASE_URL`; `prisma.config.ts` uses `DIRECT_URL` when it is available.

Do not put production credentials in Git.

Before the first production deployment, apply all committed migrations to the production database with:

```bash
npx prisma migrate deploy
```

Do not add `prisma migrate deploy` to the Next.js build command, because Preview builds must not mutate the production database.

## Vercel environment variables

Configure these in the Vercel project:

Required:

- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`

Optional Google OAuth:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`

Optional password-reset email:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

For production, `NEXT_PUBLIC_APP_URL` must be the final HTTPS application origin and `GOOGLE_REDIRECT_URI` must exactly match the Google OAuth client's production callback URL.

After changing Vercel environment variables, redeploy so the new values are used.

## Deployment gate

A deployment should only be considered complete after:

1. GitHub CI is green.
2. Production database migrations succeed.
3. Vercel build succeeds.
4. `/api/health` succeeds against the production database.
5. Register/login works.
6. Booking and payment create a ticket.
7. The ticket page loads for its owner.
8. The public QR verification page reports the correct ticket state.
9. My Tickets shows the created ticket.

## Important

The payment endpoint currently represents the application's booking/payment-completion flow; it is not an integration with a live payment gateway. A real payment provider requires a separate integration with webhook verification and idempotency handling.
