# Developer Tools Portal

Containerized Node.js application for an internal Developer Tools landing page. Public users can view tool links, authenticated users can view the same portal, and administrators can create, update, and delete links.

## Stack

- Backend: NestJS, TypeScript, MongoDB via Mongoose, JWT authentication, role guards.
- Frontend: React, TypeScript, Vite, Tailwind CSS, lucide-react icons.
- Database: MongoDB as the NoSQL store.
- Deployment: Dockerfiles plus Docker Compose configurations for dev, test, and prod.
- CI: GitHub Actions installs dependencies, builds both workspaces, and runs tests.

The frontend container currently serves the built Vite app with `vite preview` to keep the stack simple for CI and assignment review. A production reverse proxy or static web server can be added later if needed.

## Live Environments

- Production: `https://developer-tools-portal.com`
- Test: `https://test.developer-tools-portal.com`

## Repository Layout

```text
backend/                 NestJS API
frontend/                React Vite app
assignment/              Original assignment files
docker-compose.dev.yml   Local development MongoDB plus optional full-stack profile
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

Create local environment files. For local profiles, keep untracked files such as `.env.dev`, `.env.test`, or `.env.prod`, then sync them into `.env`, `backend/.env`, and `frontend/.env`. If a standard profile file does not exist, the script uses built-in defaults for that profile:

```bash
npm run env -- dev
npm run env -- test
npm run env -- prod
```

For day-to-day development, start MongoDB only and run backend/frontend with hot reload:

```bash
docker compose -f docker-compose.dev.yml up -d
npm run dev:backend
npm run dev:frontend
```

To emulate the deployed container setup locally, run the full dev Compose profile instead:

```bash
npm run env -- dev
docker compose -f docker-compose.dev.yml --profile full up --build
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Health check: `http://localhost:3000/api/health`
- MongoDB: `mongodb://127.0.0.1:27017/developer_tools_portal`

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

Development starts only MongoDB by default:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Development can also run the full containerized stack:

```bash
docker compose -f docker-compose.dev.yml --profile full up --build
```

Test stack runs all services on separate host ports:

```bash
npm run env -- test
docker compose -f docker-compose.test.yml up --build -d
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

## VM Deployment Notes

The repository includes manual GitHub Actions workflows for deploying the test and production stacks to a Hetzner VM:

```text
.github/workflows/deploy-test.yml
.github/workflows/deploy-prod.yml
```

The test workflow deploys `main` with `docker-compose.test.yml`, creates `.env.test` on the server from GitHub environment secrets and variables, and checks `https://test.developer-tools-portal.com/api/health`.

The production workflow deploys `main` with `docker-compose.prod.yml`, creates `.env.prod` on the server from GitHub environment secrets and variables, and checks `https://developer-tools-portal.com/api/health`.

Both workflows can use the same VM checkout path, for example `APP_PATH=/home/deploy/apps/developer-tools-portal`. Test and production are separated by `.env.test`/`.env.prod`, different Docker Compose project names, different volumes, and different host ports.

For manual VM deployment, run `scripts/use-env.mjs` first and point Docker Compose at the generated root `.env` file:

```bash
cd /home/deploy/apps/developer-tools-portal
node scripts/use-env.mjs test
docker compose -p developer-tools-portal-test -f docker-compose.test.yml --env-file .env up -d --build --remove-orphans
```

For production, create `.env.prod` with real secrets first, then run:

```bash
cd /home/deploy/apps/developer-tools-portal
node scripts/use-env.mjs prod
docker compose -p developer-tools-portal-prod -f docker-compose.prod.yml --env-file .env up -d --build --remove-orphans
```

Required GitHub repository secrets shared by both deploy workflows:

- `HETZNER_HOST`
- `HETZNER_USER`
- `HETZNER_SSH_KEY`
- `APP_PATH`

Required GitHub environment secrets for both `test` and `production`:

- `JWT_SECRET`

Optional GitHub environment secrets:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `USER_EMAIL`
- `USER_PASSWORD`

Default test environment variables:

- `HETZNER_PORT` defaults to `22`
- `APP_URL` defaults to `https://test.developer-tools-portal.com`
- `FRONTEND_BIND` defaults to `127.0.0.1`
- `FRONTEND_PORT` defaults to `18081`
- `BACKEND_BIND` defaults to `127.0.0.1`
- `BACKEND_PORT` defaults to `19031`
- `CORS_ORIGIN` defaults to `https://test.developer-tools-portal.com`
- `VITE_API_URL` defaults to `/api`, which Nginx routes to the test backend
- `VITE_APP_ENV` defaults to `test`
- `JWT_EXPIRES_IN` defaults to `1h`
- `SEED_ON_START` defaults to `true`

Default production environment variables:

- `HETZNER_PORT` defaults to `22`
- `APP_URL` defaults to `https://developer-tools-portal.com`
- `FRONTEND_BIND` defaults to `127.0.0.1`
- `FRONTEND_PORT` defaults to `28080`
- `BACKEND_BIND` defaults to `127.0.0.1`
- `BACKEND_PORT` defaults to `29030`
- `CORS_ORIGIN` defaults to `https://developer-tools-portal.com,https://www.developer-tools-portal.com`
- `VITE_API_URL` defaults to `/api`, which Nginx routes to the production backend
- `VITE_APP_ENV` defaults to empty, so no environment badge is shown in production
- `JWT_EXPIRES_IN` defaults to `1h`
- `SEED_ON_START` defaults to `true`

The default deployment ports are chosen to avoid the existing VM services listed during setup, and bind to `127.0.0.1` so nginx remains the public entry point.

Nginx reverse proxy examples are available in `conf/`:

- `conf/nginx-developer-tools-portal.test.conf` for `test.developer-tools-portal.com`
- `conf/nginx-developer-tools-portal.prod.conf` for `developer-tools-portal.com`

The nginx configs keep Docker service ports private and expose the app through the public domains:

- `/api/` is proxied to the backend container port on `127.0.0.1`.
- `/api/auth/login` has a stricter rate limit because it is the password-authentication endpoint.
- all other paths are proxied to the frontend container, with `/index.html` fallback for Vite client-side routing.
- `limit_req_zone` defines shared request counters used by the per-route `limit_req` rules.

Example production rate-limit zones:

```nginx
limit_req_zone $binary_remote_addr zone=developer_tools_portal_prod_api:10m rate=120r/m;
limit_req_zone $binary_remote_addr zone=developer_tools_portal_prod_auth:10m rate=5r/m;
```

In plain terms, these lines tell nginx to track requests per visitor IP address:

- `$binary_remote_addr` means nginx groups requests by client IP address.
- `zone=...` gives the rate-limit bucket a name so route blocks can reference it later.
- `10m` reserves 10 MB of nginx memory for tracking request counters.
- `rate=120r/m` allows roughly 120 requests per minute per IP for normal API traffic.
- `rate=5r/m` allows roughly 5 requests per minute per IP for login attempts.

The login endpoint uses the stricter limit because `/api/auth/login` is where password guessing or brute-force attempts would happen. Normal API routes can allow more traffic, but authentication should be more conservative.

The route-level `limit_req` lines in the nginx files apply these named buckets to actual routes. `burst` allows a small temporary spike, and `nodelay` makes nginx handle that spike immediately instead of slowly queueing requests.

## Security Notes

- Passwords are stored as bcrypt hashes.
- JWTs are signed with `JWT_SECRET`; use a long random value outside local development.
- Admin routes are protected with both JWT authentication and an admin role guard.
- Request bodies are validated with `class-validator`.
- Helmet is enabled for common HTTP hardening.
