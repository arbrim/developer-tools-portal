# Developer Tools Portal

Containerized Node.js application for an internal Developer Tools landing page. Public users can view tool links, authenticated users can view the same portal, and administrators can create, update, and delete links.

## Stack

- Backend: NestJS, TypeScript, MongoDB via Mongoose, JWT authentication, role guards.
- Frontend: React, TypeScript, Vite, Tailwind CSS, lucide-react icons.
- Database: MongoDB as the NoSQL store.
- Deployment: Dockerfiles plus Docker Compose configurations for dev, test, and prod.
- CI: GitHub Actions installs dependencies, builds both workspaces, and runs tests.

The frontend container currently serves the built Vite app with `vite preview` to keep the stack simple for CI and assignment review. A production reverse proxy or static web server can be added later if needed.

## Repository Layout

```text
backend/                 NestJS API
frontend/                React Vite app
assignment/              Original assignment files
docker-compose.dev.yml   Local development MongoDB only
docker-compose.test.yml  Full stack with env-configurable test ports
docker-compose.prod.yml  Full stack with env-configurable production ports
.env.example              Root environment template for Compose and env sync
scripts/use-env.mjs       Sync local env profiles into root/backend/frontend env files
.github/workflows/ci.yml CI build pipeline
```

## Initial Project Commands

The project files are committed directly, but these are the official commands that correspond to the chosen stack:

```bash
npm i -g @nestjs/cli
nest new backend
npm create vite@latest frontend -- --template react-ts
```

Tailwind CSS setup follows the Vite guide:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Local Development

Install dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Create a local root environment file:

```bash
cp .env.example .env
```

For local profiles, keep untracked files such as `.env.dev`, `.env.test`, or `.env.prod`, then sync them into `.env`, `backend/.env`, and `frontend/.env`. If a standard profile file does not exist, the script uses built-in defaults for that profile:

```bash
npm run env -- dev
npm run env -- test
npm run env -- prod
```

Start MongoDB only:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Run the backend:

```bash
npm run dev:backend
```

Run the frontend in another terminal:

```bash
npm run dev:frontend
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Health check: `http://localhost:3000/api/health`
- MongoDB: `mongodb://localhost:27017/developer_tools_portal`

## Seed Data

The backend seeds data on startup when `SEED_ON_START=true`.

Default users:

- Admin: `admin@example.com` / `Admin123!`
- User: `user@example.com` / `User123!`

Default links:

- Jira: Project Management
- Grafana: Monitoring
- Kibana: Logs
- Jenkins: CI/CD
- Kubernetes: Cluster Dashboard
- SonarQube: Code Quality
- GitLab: Source Code

The links are stored in MongoDB and are not hardcoded into the frontend.

## API

Public:

- `GET /api/health`
- `GET /api/links`
- `POST /api/auth/login`

Admin JWT required:

- `GET /api/links?includeInactive=true`
- `POST /api/links`
- `PATCH /api/links/:id`
- `DELETE /api/links/:id`

Use `Authorization: Bearer <token>` for protected routes.

## Docker Compose

Development starts only MongoDB:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Test stack runs all services on separate host ports:

```bash
npm run env -- test
docker compose -f docker-compose.test.yml up --build
```

Test URLs:

- Frontend: `http://localhost:18081`
- Backend: `http://localhost:19031/api`

Production-like stack:

```bash
npm run env -- prod
docker compose -f docker-compose.prod.yml up --build -d
```

Production-like URLs:

- Frontend: `http://localhost:28080`
- Backend: `http://localhost:29030/api`

For a VM deployment, set the environment values before running the prod compose file:

```bash
FRONTEND_PORT=28080
BACKEND_PORT=29030
JWT_SECRET=...
CORS_ORIGIN=https://portal.example.com
VITE_API_URL=https://api.example.com/api
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
docker compose -f docker-compose.prod.yml up --build -d
```

## CI/CD Notes

The included GitHub Actions workflow runs in GitHub-hosted runners. It does not need to SSH into a VM for build checks:

1. Checkout repository.
2. Setup Node.js 20.
3. Run `npm ci`.
4. Build backend and frontend with `npm run build`.
5. Run tests with `npm test`.

Deploying to a VM is a separate CD step. A common approach is:

1. CI builds and tests on GitHub-hosted runners.
2. CD authenticates to the VM using a GitHub secret SSH key.
3. The VM pulls the repository or a built image.
4. The VM creates an untracked `.env` from VM secrets and runs `docker compose -f docker-compose.prod.yml up -d --build`.

For production, prefer building and pushing versioned images to a registry, then having the VM pull immutable image tags instead of running `npm install` directly on the VM.

## Security Notes

- Passwords are stored as bcrypt hashes.
- JWTs are signed with `JWT_SECRET`; use a long random value outside local development.
- Admin routes are protected with both JWT authentication and an admin role guard.
- Request bodies are validated with `class-validator`.
- Helmet is enabled for common HTTP hardening.
