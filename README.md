# Cloud Storage Odin

![React](https://img.shields.io/badge/React-19.2.7-61DAFB?style=flat-square&logo=react&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?style=flat-square&logo=typescript&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-8.1.1-646CFF?style=flat-square&logo=vite&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=fff)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=flat-square&logo=express&logoColor=fff)
![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?style=flat-square&logo=prisma&logoColor=fff)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pg%208.22.0-4169E1?style=flat-square&logo=postgresql&logoColor=fff)
![Passport.js](https://img.shields.io/badge/Passport.js-0.7.0-34E27A?style=flat-square&logo=passport&logoColor=000)
![AWS S3 Compatible Storage](https://img.shields.io/badge/S3%20Compatible%20Storage-AWS%20SDK%203.1095.0-FF9900?style=flat-square&logo=amazons3&logoColor=fff)
[![Main CI](https://github.com/aayusht200/cloudStorage-Odin/actions/workflows/main.yml/badge.svg)](https://github.com/aayusht200/cloudStorage-Odin/actions/workflows/main.yml)

Cloud Storage Odin is a full-stack cloud storage app for managing personal files and folders in a browser. It supports account-based access, nested folders, file uploads, inline previews for supported media, and signed links for stored files.

## Live Demo

https://cloud-storage-odin-client-rose.vercel.app

![Cloud Storage Odin drive dashboard](screenshot/home.png)

## Repository

https://github.com/aayusht200/cloudStorage-Odin

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Backend Overview](#backend-overview)
- [Testing](#testing)
- [Deployment](#deployment)
- [Challenges](#challenges)
- [Current Project Status](#current-project-status)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

- User registration, login, and logout
- Session-based authentication with Passport.js
- Protected frontend routes with React Router loaders
- Folder creation, deletion, and navigation
- Breadcrumb navigation
- File upload to S3-compatible object storage
- File preview for images, PDFs, audio, and video
- File metadata display
- Signed file URL copy/share action
- File deletion
- Download fallback for files without inline preview support
- Schema-driven form and request validation with Zod
- CSRF protection for authenticated state-changing API requests
- Unit and integration tested backend controllers, routes, validation middleware, and Zod schemas with Vitest and Supertest
- Tested frontend pages, context, schemas, helpers, API services, and React Router loaders with Vitest
- End-to-end browser coverage for auth, theme, folder, and file workflows with Playwright
- Light, dark, and system theme toggle
- Responsive drive grid and form layouts

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, React Router, React Hook Form, Tailwind CSS, Base UI, Axios, Zod |
| Backend | Node.js, Express, Passport.js, Express Session, connect-pg-simple, Multer, Zod, bcrypt, CORS, CSRF middleware |
| Database | PostgreSQL, Prisma, `pg`, `connect-pg-simple` |
| Storage | AWS SDK for S3-compatible object storage |
| Testing | Vitest, Supertest, Testing Library, jsdom, Playwright, V8 coverage |
| Tooling | ESLint, Prettier, Nodemon, Prisma CLI |

## Project Structure

```text
cloudStorage-Odin/
├── client/   # Vite React app, routes, loaders, UI components, contexts, and API services
└── server/   # Express API, controllers, routes, Prisma schema, auth, sessions, and storage logic
```

- `client/src/pages`: route-level screens for authentication, drive browsing, uploads, folder creation, loading, and errors.
- `client/src/components`: reusable UI elements used across the drive and auth flows.
- `client/src/service`: Axios API client and request helpers for auth, folders, files, upload, deletion, and CSRF token handling.
- `client/src/loaders`: React Router loaders for authentication redirects and drive/file data fetching.
- `client/src/schema`: Zod schemas and inferred payload types used for form validation and service contracts.
- `client/tests`: Vitest `.test.*` tests for pages, context, schemas, helpers, API services, and React Router loaders, plus Playwright `.spec.ts` E2E tests under `client/tests/E2E`.
- `server/routes`: Express routers for user, folder, and file endpoints.
- `server/controller`: request handlers for authentication, folder operations, and file operations.
- `server/schema`: Zod schemas used by reusable validation middleware for request bodies, route parameters, and uploaded files.
- `server/middleware`: authentication middleware, CSRF verification, and reusable Zod request validation before controllers execute.
- `server/config`: database, session, Passport, Multer, and S3-compatible storage configuration.
- `server/service`: storage helpers for upload, deletion, signed URLs, and path generation.
- `server/prisma`: Prisma schema and migrations for users, folders, and files.
- `server/Tests`: Vitest unit and Supertest integration tests for backend schemas, middleware, controllers, and routes, with integration fixtures for users, folders, files, and uploaded objects.

## Screenshots

### Login

![Login form with email and password fields](screenshot/login.png)

### Signup

![Signup form with name, email, and password fields](screenshot/signup.png)

### Drive

![Drive dashboard showing a folder and uploaded image files](screenshot/home.png)

### Folder Creation

![Create folder form for adding a folder in the root directory](screenshot/folderCreation.png)

### File Upload

![Upload form for choosing and submitting a file](screenshot/fileUpload.png)

### Empty Drive

![Empty drive state with an upload prompt](screenshot/emptyDrive.png)

## Getting Started

1. Clone the repository.

```bash
git clone git@github.com:aayusht200/cloudStorage-Odin.git
cd cloudStorage-Odin
```

2. Install frontend dependencies.

```bash
cd client
npm install
```

3. Install backend dependencies.

```bash
cd ../server
npm install
```

4. Configure environment variables.

Create `.env` files in `client/` and `server/` with the variables listed below.

5. Run the frontend.

```bash
cd client
npm run dev
```

6. Run the backend.

```bash
cd server
npm run dev
```

### Available Scripts

| Directory | Script | Purpose |
| --- | --- | --- |
| `client` | `npm run dev` | Start the Vite development server |
| `client` | `npm run build` | Build the production frontend |
| `client` | `npm run lint` | Run ESLint |
| `client` | `npm run typecheck` | Run the TypeScript project check |
| `client` | `npm run preview` | Preview the production frontend build |
| `client` | `npm test` | Run Vitest |
| `client` | `npm test -- --coverage --run` | Run frontend tests with V8 coverage |
| `client` | `npm run test:e2e` | Run Playwright E2E tests |
| `server` | `npm run dev` | Start the API with Nodemon |
| `server` | `npm start` | Start the API with Node |
| `server` | `npm run generate` | Generate the Prisma client |
| `server` | `npm run lint` | Run ESLint |
| `server` | `npm test` | Run backend Vitest tests |
| `server` | `npm run coverage` | Run backend tests with V8 coverage |
| root | `npm test` | Run workspace Vitest tests |
| root | `npm run coverage-client` | Run frontend coverage from the workspace root |
| root | `npm run coverage-server` | Run backend coverage from the workspace root |
| root | `npm run test-ui-client` | Open the Vitest UI for the client workspace |
| root | `npm run test-ui-server` | Open the Vitest UI for the server workspace |

The latest verified frontend automation reports 116 passing tests: 100 Vitest unit/component tests and 16 Playwright E2E tests. The backend suite contains 143 Vitest/Supertest tests across 11 files.

## Environment Variables

### Frontend

```text
VITE_API_URL
```

### Backend

```text
PORT
SESSION_SECRET
NODE_ENV
DATABASE_URL
S3_REGION
S3_ENDPOINT
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
S3_BUCKET_NAME
```

## Backend Overview

### Authentication Flow

The API uses `express-session` with a PostgreSQL-backed session store and Passport local authentication. Signup validates the request body, checks for an existing user, hashes the password with bcrypt, and creates the user plus a root folder in a Prisma transaction. Login validates credentials through Passport, stores the authenticated user id and CSRF token in the session, and saves the session before responding. Protected routes use `requireAuth`, and logout destroys the session before clearing the `connect.sid` cookie.

### Security Overview

Authenticated sessions are stored in PostgreSQL through `connect-pg-simple`. Production cookies use `secure: true` and `sameSite: "none"` for the cross-origin Vercel to Render flow. The API allows credentialed CORS requests from local frontend ports and matching deployed Vercel frontend URLs. Authenticated state-changing routes require the session CSRF token in the `x-csrf-token` header before controllers execute. Stored files remain in S3-compatible private storage and are accessed through signed URLs.

### API Overview

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/users/signup` | Create an account |
| `POST` | `/api/users/login` | Login with Passport and return a CSRF token |
| `POST` | `/api/users/logout` | Logout the current session; requires CSRF token |
| `GET` | `/api/users/me` | Return the current user, root folder id, and CSRF token |
| `POST` | `/api/folders/create` | Create a folder; requires CSRF token |
| `GET` | `/api/folders/:id` | Get a folder, its children, files, and path |
| `DELETE` | `/api/folders/:id` | Delete a folder; requires CSRF token |
| `POST` | `/api/files/create` | Upload a file; requires CSRF token |
| `GET` | `/api/files/:id` | Get file metadata, path, and a signed URL |
| `DELETE` | `/api/files/:id` | Delete a file; requires CSRF token |

### Database Overview

Prisma models users, folders, and files in PostgreSQL. Users have a unique email, role, hashed password, folders, and files. Folders belong to users, support parent-child nesting, and enforce unique folder names per user and parent folder. Files belong to both a user and folder, store original metadata, and use a unique storage object name.

### Storage Overview

Uploads are parsed in memory with Multer, limited to 10 MB, and stored through the AWS SDK S3 client against an S3-compatible endpoint. Stored objects use generated UUID keys. File reads return signed URLs that expire after one hour, and deletes remove the object before deleting database metadata.

### Validation Strategy

Zod schemas validate auth payloads, folder creation payloads, route ids, and uploaded file objects. The reusable `validate` middleware parses `body`, `params`, or `file`, replaces the request target with parsed data, and returns `400` with flattened Zod errors when validation fails. CSRF verification runs on authenticated state-changing routes before controller logic. File uploads are also filtered by Multer before controller logic runs.

### Error Handling

Controllers return explicit client errors for expected cases such as duplicate users, duplicate folders, missing folders, missing files, invalid folder ids, unauthenticated requests, and validation failures. Unexpected errors are passed to the centralized Express error handler, which returns the error status when present or `500`.

## Testing

### Backend Testing

Backend tests use Vitest, Supertest, and V8 coverage in a Node environment. Tests are organized under `server/Tests`, with unit tests under `server/Tests/Unit Test` and HTTP integration tests under `server/Tests/Integration`.

| Test type | Current coverage |
| --- | --- |
| Unit tests | Controllers, CSRF middleware, validation middleware, and Zod schemas |
| Integration tests | User routes, login/session behavior, logout/session destruction, folder routes, file routes, authentication failures, validation failures, file upload/delete behavior, and database-backed request flows |

Controller unit tests mock Prisma, bcrypt, Passport, request/session methods, response helpers, and storage helpers where appropriate. Middleware tests exercise CSRF checks plus body, params, and file validation. Schema tests cover valid and invalid input, boundary conditions, UUID validation, file upload schema validation, MIME types, password complexity, and email validation.

Supertest is used for HTTP integration testing. Tests use `request.agent(app)` where session and cookie persistence is required across login, authenticated requests, and logout. Backend integration tests now create their own required users, folders, files, and uploaded S3-compatible storage objects where needed, then clean up test data afterward instead of depending on manually persisted development database records.

Latest verified backend result:

| Metric | Result |
| --- | --- |
| Test files | 11 passed |
| Tests | 143 passed |
| Statements | 95.13% |
| Branches | 80% |
| Functions | 90.62% |
| Lines | 94.88% |

The backend integration suite still requires a configured and reachable test/development database, a configured and reachable S3-compatible storage environment, and the existing upload fixture file used by the file route tests.

### Frontend Testing

Frontend unit and component tests use Vitest, Testing Library, jsdom, service mocking, React Router dependency mocking, and V8 coverage. Vitest tests use the `.test.*` naming convention and cover pages, context, Zod schemas, helper functions, API services, and React Router loaders.

| Area | Covered |
| --- | --- |
| Pages | Login, signup, drive, file preview, upload, folder creation, home redirect, and error pages |
| Context | UserProvider behavior |
| Zod schemas | Auth, file, and folder schemas |
| Helper functions | `getFileIcon` |
| API services | `authenticate`, `createFolder`, `deleteFile`, `deleteFolder`, `getFile`, `getFolder`, `login`, `logout`, `signup`, `upload` |
| React Router loaders | `authRedirectLoader`, `driveLoader`, `filesLoader`, `rootLoader` |

Verified Vitest command:

```bash
npm run coverage-client -- --run
```

Latest verified frontend result:

| Metric | Coverage |
| --- | --- |
| Test files | 27 passed |
| Tests | 100 passed |
| Statements | 85.05% |
| Branches | 83.67% |
| Functions | 75.65% |
| Lines | 85.25% |

Loaders, schemas, and helpers report 100% coverage in the latest frontend coverage run. Pages are effectively covered at 98.93% statements, and service coverage is 95.34% statements after the CSRF token handling update. Remaining uncovered code is primarily UI infrastructure, third-party-derived UI primitives, and partial context/provider branches rather than missing application workflows.

Playwright E2E tests live under `client/tests/E2E` and use the `.spec.ts` naming convention. The current E2E suite has 16 passing browser tests covering the home page, signup, login, logout, theme switching and persistence, system light/dark behavior, folder creation/navigation/deletion, file upload, file details, share-link copying, and file deletion.

```bash
cd client
npm run test:e2e
```

GitHub Actions runs the full project check on push, pull request, and manual dispatch: client lint, Vitest tests, typecheck, build, Prisma client generation, database migrations, server lint, server unit and integration tests, and Playwright E2E tests.

## Deployment

| Layer | Production Service |
| --- | --- |
| Frontend | Vercel |
| Backend | Render |
| Database | Supabase PostgreSQL |
| File storage | S3-compatible object storage |

GitHub Actions provides CI checks. CD is handled by the connected hosting platforms: the client deploys on Vercel and the server deploys on Render from the main branch.

The root `vercel.json` routes `/api/:path*` requests to the Render backend and rewrites other requests to `index.html` for client-side routing.
Incoming API payloads are validated with Zod middleware before reaching controllers.
Authenticated state-changing API requests are also checked by CSRF middleware before reaching controllers.

## Challenges

- Maintaining session-based authentication across a separate frontend and backend.
- Persisting sessions in PostgreSQL while supporting production cookie settings.
- Modeling folders and files so users can navigate a nested folder hierarchy.
- Uploading files through the API and storing them in S3-compatible object storage.
- Generating signed URLs for file preview and copy/share actions.
- Using React Router loaders for route protection, redirects, and drive data fetching.
- Configuring credentialed CORS between local development and deployed Vercel frontend URLs.
- Supporting SPA routing on Vercel with an `index.html` rewrite.

## Current Project Status

The project has a working full-stack implementation with session authentication, CSRF-protected mutations, nested folders, file upload and deletion, signed file URLs, Zod validation, Prisma migrations, backend unit/integration tests, frontend unit/component tests, Playwright E2E tests, GitHub Actions CI, and platform-managed CD through Vercel and Render.

## Future Improvements

- Multiple file upload
- Drag-and-drop uploads
- File and folder rename support
- Search across files and folders
- Dedicated download action for all file types
- Maintain and expand tests as new UI and API features are added
- Improved empty states and loading states

## License

MIT
