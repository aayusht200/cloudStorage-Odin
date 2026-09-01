# Cloud Storage Odin Client

[![Main CI](https://github.com/aayusht200/cloudStorage-Odin/actions/workflows/main.yml/badge.svg)](https://github.com/aayusht200/cloudStorage-Odin/actions/workflows/main.yml)

The client is a Vite React app for the Cloud Storage Odin drive UI. It handles authentication screens, protected drive routes, folder navigation, file upload forms, file previews, and theme switching.

## Tech Stack

- React 19, TypeScript, and React Router
- Vite with the React Compiler preset
- Tailwind CSS 4
- Axios with credentialed requests and CSRF token headers for mutations
- Base UI, shadcn-style primitives, Lucide, and Tabler icons
- Vitest, Testing Library, jsdom, Playwright, and V8 coverage

## Setup

Install dependencies from this directory:

```bash
npm ci
```

Create `client/.env` and point the app at the API server:

```env
VITE_API_URL=http://localhost:3000
```

The backend must also be running. See [../server/README.md](../server/README.md).

## Development

```bash
npm run dev
```

Vite prints the local URL when it starts. The usual development URL is `http://localhost:5173`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript project check |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run frontend Vitest tests |
| `npm test -- --coverage --run` | Run frontend tests with V8 coverage |
| `npm run test:e2e` | Run Playwright E2E tests |

The production build is written to `client/dist/`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirect based on auth state |
| `/login` | Login form |
| `/signup` | Signup form |
| `/drive/:id` | Folder contents |
| `/upload/:id` | Upload a file to a folder |
| `/file/:id` | File preview/details |
| `/:id/createfolder` | Create a child folder |

## Testing

Frontend tests are organized under `client/tests`. Vitest `.test.*` files cover schemas, helpers, services, loaders, pages, and UserProvider behavior. Playwright `.spec.ts` files live under `client/tests/E2E` and cover end-to-end browser workflows.

| Area | Covered |
| --- | --- |
| Pages | `Login`, `SignupPage`, `DrivePage`, `FilesPage`, `UploadPage`, `CreateFolderPage`, `HomeRedirect`, `ErrorPage` |
| Context | `UserProvider` behavior |
| Zod schemas | `authSchema`, `fileSchema`, `folderSchema` |
| Helper functions | `getFileIcon` |
| API services | `authenticate`, `createFolder`, `deleteFile`, `deleteFolder`, `getFile`, `getFolder`, `login`, `logout`, `signup`, `upload` |
| React Router loaders | `authRedirectLoader`, `driveLoader`, `filesLoader`, `rootLoader` |

The Vitest tests use Testing Library, jsdom, V8 coverage, Axios/service mocking, and React Router dependency mocking.
Service tests include the shared Axios client behavior that stores CSRF tokens from auth responses and sends `x-csrf-token` on state-changing requests.

Latest verified Vitest result:

| Metric | Coverage |
| --- | --- |
| Test files | 27 passed |
| Tests | 100 passed |
| Statements | 85.05% |
| Branches | 83.67% |
| Functions | 75.65% |
| Lines | 85.25% |

Loaders, schemas, and helpers report 100% coverage in the latest coverage run. Pages are effectively covered at 98.93% statements, and service coverage is 95.34% statements after the CSRF token handling update. Overall frontend coverage is lower because UI infrastructure, third-party-derived UI primitives, and some context/provider branches remain partially uncovered.

Latest verified Playwright result:

| Metric | Result |
| --- | --- |
| E2E tests | 16 passed |

Playwright covers the home page, signup, login, logout, theme switching and persistence, system light/dark behavior, folder creation, folder navigation, folder deletion, file upload, file details, share-link copying, and file deletion. The E2E suite requires the frontend dev server, backend API, database, S3-compatible storage, and the existing upload fixture used by the tests.

GitHub Actions runs the client lint, Vitest tests, typecheck, production build, and Playwright E2E suite as part of the repository `Main CI` workflow.

### Testing Roadmap

Completed:

- Backend unit tests
- Backend integration tests
- Frontend tests for pages, UserProvider behavior, schemas, helpers, services, and loaders
- Playwright E2E tests for core browser workflows
- GitHub Actions CI for linting, tests, typecheck, build, and E2E checks

Next:

- Maintain coverage as new frontend features are added

## Deployment

The client is deployed on Vercel. The project includes `vercel.json` with a rewrite to `index.html` so browser refreshes work on client-side routes and an `/api/:path*` rewrite to the Render backend. Set `VITE_API_URL` in the deployment environment to the production API URL.
