# Deployment guide

This project is split into a Vite frontend and an Express API. MongoDB and SMTP are external services and must be configured through environment variables.

## 1. Required services

- Node.js 20 or newer
- MongoDB 7+ or a compatible managed MongoDB deployment
- SMTP provider for administrator contact notifications

## 2. Backend configuration

Copy `apps/server/.env.example` to `apps/server/.env` for local work. Configure at minimum:

```text
NODE_ENV=production
PORT=5000
CLIENT_ORIGIN=https://your-frontend-domain.example
PUBLIC_API_URL=https://your-api-domain.example
MONGODB_URI=your-mongodb-connection-string
ALLOW_START_WITHOUT_DB=false
JWT_SECRET=a-long-random-production-secret
JWT_EXPIRES_IN=1d
COOKIE_NAME=portfolio_token
```

For email notifications, also configure:

```text
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=your-sender@example.com
CONTACT_RECEIVER=your-inbox@example.com
```

Never commit either `.env` file. The production JWT secret must be unique and at least 32 characters.

## 3. Install, seed, and run

From the repository root:

```bash
npm install
npm run test
npm run build
```

To create the initial portfolio-content document, run:

```bash
npm run seed --workspace apps/server
```

To create the first administrator, set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in the server environment and run the private one-time command:

```bash
npm run admin:create --workspace apps/server
```

The command refuses to overwrite an existing account. There is no public registration endpoint.

## 4. Resume uploads

Administrators can upload a PDF resume, project screenshots, and a profile photo from the dashboard. Uploads are limited to 5 MB per file and are stored in `apps/server/uploads` during local development. The API saves generated public URLs in the relevant MongoDB records.

For production, mount `apps/server/uploads` on persistent storage or replace the local storage adapter with an object-storage provider. Do not deploy the API on an ephemeral filesystem if the uploaded resume must survive restarts or redeployments.

Start the API in production with:

```bash
npm run start
```

The frontend build output is located in `apps/client/dist` and can be served by a static host or CDN. Configure the frontend `VITE_API_URL` to the deployed API base URL, including `/api`.

## 5. Health checks

Use these endpoints from a deployment monitor:

```text
GET /api/health
GET /api/health/ready
```

`/api/health/ready` returns a non-success status until MongoDB is connected.

## 6. Security checklist

- Use HTTPS for both frontend and API.
- Set `CLIENT_ORIGIN` to the exact frontend origin.
- Keep JWT, MongoDB, and SMTP credentials in the hosting provider’s secret manager.
- Do not enable wildcard CORS in production.
- Rotate the initial administrator password after first login if required by the hosting policy.
- Review rate-limit and reverse-proxy settings when placing the API behind a load balancer.

## 7. Release checklist

- Run `npm run check`.
- Confirm MongoDB connectivity with `/api/health/ready`.
- Submit one controlled contact-form test and confirm its database record and SMTP notification status.
- Verify admin login, logout, CRUD operations, and protected-route redirects.
- Confirm the public build loads with the production `VITE_API_URL`.
