# Cloud Storage Odin Client

[![Main CI](https://github.com/aayusht200/cloudStorage-Odin/actions/workflows/main.yml/badge.svg)](https://github.com/aayusht200/cloudStorage-Odin/actions/workflows/main.yml)

The client is a Vite React application for the Cloud Storage Odin browser UI. It owns authentication screens, protected drive navigation, folder and file views, uploads, previews, theme state, and the Axios API client.

See the [root README](../README.md) for the complete project overview, environment variable reference, database/storage behavior, API table, and CI/deployment notes.

## Tech Stack

- React, TypeScript, Vite, and React Router
- React Hook Form and Zod for client-side form validation
- Axios with credentialed requests and CSRF headers for mutations
- Tailwind CSS, Base UI/shadcn-style primitives, Lucide, and Tabler icons
- Vitest, Testing Library, jsdom, Playwright, and V8 coverage

## Setup

Dependencies are installed from the repository root through npm workspaces:

```bash
cd ..
npm ci
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Run the server in a separate terminal, then start the client:

```bash
npm run dev
```

Vite normally serves the client at `http://localhost:5173`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirect to the user’s root drive or `/login` |
| `/login` | Login form |
| `/signup` | Signup form |
| `/drive/:id` | Folder contents |
| `/upload/:id` | Upload a file to a folder |
| `/file/:id` | File metadata and preview |
| `/:id/createfolder` | Create a child folder |

`rootLoader` loads the current session. Auth redirect, drive, and file loaders handle protected navigation and redirect unauthenticated users to `/login`. Services in `src/service` call the server API through the shared Axios instance with `withCredentials: true`.

After login or session hydration, the client stores the server-provided CSRF token in memory. The Axios request interceptor sends it as `x-csrf-token` for `POST`, `PUT`, `PATCH`, and `DELETE` requests.

## Scripts

Run these from `client/`, or prefix them with `npm --workspace client` from the repository root.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create the production build in `dist/` |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript project check |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run Vitest in watch mode |
| `npm test -- --run` | Run Vitest once |
| `npm test -- --coverage --run` | Run Vitest once with V8 coverage |
| `npm run test:e2e` | Run Playwright E2E tests |

## Testing

Vitest tests are under `client/tests` and use the `.test.*` naming convention. They cover:

- Pages: login, signup, drive, file preview, upload, folder creation, home redirect, and error handling
- `UserProvider` behavior
- Client Zod schemas, file-icon helpers, API services, and React Router loaders

The current local run passes 27 Vitest files and 100 tests:

```bash
npm test -- --run
```

Playwright tests are under `client/tests/E2E` and currently list 16 tests across seven files. They cover signup/login/logout, theme switching and persistence, folder creation/navigation/deletion, file upload/details/deletion, and signed-link copying.

```bash
npm run test:e2e
```

The E2E config starts the Vite server, but the API must already be running at `http://localhost:3000`. The database, S3-compatible storage, and the committed `client/tests/E2E/test.png` fixture are also required for the full workflow suite.

## Deployment

The frontend production target is Vercel. The root `vercel.json` provides the SPA fallback to `/index.html` and rewrites `/api/:path*` to the Render API at `https://cloudstorage-odin.onrender.com/api/:path*`. Set `VITE_API_URL` in the Vercel project environment to the API URL used by the client.

The Vercel project configuration itself is external to this repository; the repository does not contain a separate client deployment script.
