# Gurbhej Singh — Developer Portfolio

Full-stack developer portfolio built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and Mongoose.

## Monorepo structure

```text
apps/
├── client/                 # React + Vite + Tailwind frontend
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── sections/
│       └── services/
└── server/                 # Express + Mongoose API
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   └── services/
    └── test/
```

## Project status

The MERN monorepo and portfolio implementation are in place:

- React + Vite client
- Express API server
- Tailwind CSS through the Vite plugin
- Workspace-level development scripts
- Environment variable templates
- API health endpoint
- Initial public/admin route shell
- MongoDB connection lifecycle
- Mongoose models and indexes
- Zod request validation
- Structured API error responses
- Public portfolio and project read endpoints
- Contact-message persistence with rate limiting
- Safe empty-content database bootstrap script
- API-backed responsive public portfolio sections
- Accessible mobile navigation and smooth section navigation
- Animated hero, reveal transitions, and reduced-motion handling
- Project, skills, journey, resume, and contact UI states
- Contact form wired to `POST /api/contact`
- JWT authentication with bcrypt password verification
- HTTP-only authentication cookies and protected admin routes
- Admin dashboard for content, projects, skills, experience, education, certifications, and messages
- Dashboard statistics and message status management
- SMTP contact notifications with persisted delivery status
- Dependency-free automated validation and normalization tests
- Lazy-loaded admin bundle and production build checks
- Deployment and operations documentation

## Local setup

Requirements:

- Node.js 20+
- npm 10+
- MongoDB 7+ or a compatible hosted MongoDB deployment

Install dependencies:

```bash
npm install
```

Copy the environment templates:

```text
apps/client/.env.example -> apps/client/.env
apps/server/.env.example -> apps/server/.env
```

Start both applications:

```bash
npm run dev
```

The client runs on `http://localhost:5173` and the API runs on `http://localhost:5000`.

Health check:

```text
GET http://localhost:5000/api/health
```

Use `apps/server/.env` to configure `MONGODB_URI`.

In development, `ALLOW_START_WITHOUT_DB=true` allows the API to expose its health endpoint in degraded mode while MongoDB is offline. The readiness endpoint will still return `503`, and production deployments should set `ALLOW_START_WITHOUT_DB=false`.

Contact submissions are always stored first. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and `CONTACT_RECEIVER` to enable administrator email notifications. If SMTP is unavailable or unconfigured, the message remains stored and its delivery status is recorded.

Administrators can attach a PDF resume, project screenshots, and a profile photo from the dashboard. Uploads are limited to 5 MB per file and are stored in `apps/server/uploads`; configure persistent storage for this directory in production.

Initialize the empty portfolio-content singleton without inventing profile data:

```bash
npm run seed --workspace apps/server
```

To create the first admin account, set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `apps/server/.env`, then run the one-time private command below. It refuses to overwrite an existing account and the password must be at least 12 characters. There is no public admin registration route.

```bash
npm run admin:create --workspace apps/server
```

Available public API endpoints:

```text
GET  /api/portfolio
GET  /api/projects
GET  /api/projects/:slug
POST /api/contact
```

## Planned implementation

See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup, environment configuration, build commands, and operational checks.
