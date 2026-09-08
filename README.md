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

Cloud Storage Odin is a full-stack browser application for managing personal files and nested folders. Users can create accounts, browse folders, upload supported files, preview media, copy signed file links, and delete files or folders.

## Live Demo

https://cloud-storage-odin-client-rose.vercel.app

![Cloud Storage Odin drive dashboard](screenshot/home.png)

## Repository

https://github.com/aayusht200/cloudStorage-Odin

## Features

- Account registration, login, logout, and session-based authentication
- Protected React Router views for drive, folder, and file data
- Nested folder creation, navigation, and deletion
- File upload, metadata display, inline previews, signed links, and deletion
- Light, dark, and system theme modes
- Zod validation on client forms and server request boundaries
- CSRF protection for authenticated state-changing API requests
- Unit, component, integration, and browser E2E test coverage

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, React Router, React Hook Form, Tailwind CSS, Axios, Zod |
| Backend | Node.js 24, Express, Passport Local, Express Session, bcrypt, Multer, Zod, CORS |
| Database | PostgreSQL, Prisma, `pg`, `connect-pg-simple` |
| File storage | AWS SDK for S3-compatible object storage |
| Testing | Vitest, Testing Library, jsdom, Supertest, Playwright, V8 coverage |
| Tooling | ESLint, Nodemon, Prisma CLI, npm workspaces |

## Project Structure

```text
cloudStorage-Odin/
├── client/                         # Vite React application
│   ├── src/pages/                  # Auth, drive, folder, upload, and file views
│   ├── src/loaders/                # React Router data and auth loaders
│   ├── src/service/                # Axios API client and request services
│   ├── src/schema/                 # Client-side Zod schemas and types
│   └── tests/                      # Vitest and Playwright tests
├── server/                         # Express API
│   ├── routes/                     # User, folder, and file routers
│   ├── controller/                 # HTTP request handlers
│   ├── middleware/                 # Auth, CSRF, and Zod validation
│   ├── service/                    # Storage and folder path/deletion helpers
│   ├── config/                     # PostgreSQL, Passport, Multer, and S3 setup
│   ├── prisma/                     # Schema and migrations
│   └── Tests/                      # Unit and Supertest integration tests
├── .github/workflows/main.yml      # CI workflow
└── vercel.json                     # Vercel rewrites for the SPA and API
```

The client owns the browser UI, route loaders, form validation, theme state, and API calls. The server owns authentication, session persistence, authorization, request validation, folder/file metadata, database access, and object storage operations.

## Getting Started

The repository uses npm workspaces and a root `package-lock.json`. From the repository root:

```bash
git clone git@github.com:aayusht200/cloudStorage-Odin.git
cd cloudStorage-Odin
npm ci
```

The root package declares Node `24.x` and npm `11.x` engines.

Create the environment files described in [Environment Variables](#environment-variables), then run the two applications in separate terminals:

```bash
npm --workspace server run dev
npm --workspace client run dev
```

The default local URLs are `http://localhost:3000` for the API and `http://localhost:5173` for the Vite client. The server must have a reachable PostgreSQL database and S3-compatible storage before authenticated, database-backed, upload, integration, or E2E flows can work.

### Workspace Scripts

| Workspace | Command | Purpose |
| --- | --- | --- |
| client | `npm --workspace client run dev` | Start the Vite development server |
| client | `npm --workspace client run build` | Type-check and build the frontend |
| client | `npm --workspace client run lint` | Run client ESLint |
| client | `npm --workspace client run typecheck` | Run the TypeScript project check |
| client | `npm --workspace client run preview` | Preview the production build |
| client | `npm --workspace client run test -- --run` | Run client Vitest tests once |
| client | `npm --workspace client run test -- --coverage --run` | Run client tests with V8 coverage |
| client | `npm --workspace client run test:e2e` | Run Playwright browser tests |
| server | `npm --workspace server run dev` | Start the API with Nodemon |
| server | `npm --workspace server start` | Start the API with Node |
| server | `npm --workspace server run generate` | Generate the Prisma client |
| server | `npm --workspace server run lint` | Run server ESLint |
| server | `npm --workspace server run test -- --run "Tests/Unit Test"` | Run server unit tests |
| server | `npm --workspace server run test -- --run "Tests/Integration"` | Run server integration tests |
| server | `npm --workspace server run coverage` | Run the server suite with V8 coverage |

The root package also defines `npm test`, `npm run coverage-client`, `npm run coverage-server`, `npm run test-ui-client`, and `npm run test-ui-server`. These are not a single CI aggregate: `npm test` invokes Vitest from the repository root, while the CI workflow uses the explicit workspace commands above.

## Environment Variables

The names below are taken from `client/.env.example`, `server/.env.example`, and the application code. Do not commit populated `.env` files.

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:3000
```

`VITE_API_URL` is the Axios base URL for the Express API.

### Server (`server/.env`)

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
SESSION_SECRET="replace-with-a-long-random-string"
S3_REGION="your-region"
S3_ENDPOINT="https://your-s3-compatible-endpoint"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-key"
S3_BUCKET_NAME="your-bucket"
```

`PORT` defaults to `3000` when it is not set. `DATABASE_URL` is used by Prisma and the PostgreSQL session pool. `NODE_ENV=production` enables production cookie and PostgreSQL SSL settings. CSRF tokens are generated per session; there is no CSRF environment variable.

## API Overview

The API is mounted under `/api`. Protected routes require the authenticated session. Authenticated state-changing routes also require the session CSRF token in the `x-csrf-token` header.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Return `{ "status": "ok" }` for health checks |
| `POST` | `/api/users/signup` | Validate and create a user plus root folder |
| `POST` | `/api/users/login` | Authenticate with Passport and return a CSRF token |
| `POST` | `/api/users/logout` | Destroy the authenticated session |
| `GET` | `/api/users/me` | Return the current user, root folder id, and CSRF token |
| `POST` | `/api/folders/create` | Create a child folder |
| `GET` | `/api/folders/:id` | Return folder contents and its path |
| `DELETE` | `/api/folders/:id` | Delete a folder recursively |
| `POST` | `/api/files/create` | Upload a file to a folder |
| `GET` | `/api/files/:id` | Return file metadata, path, and a signed URL |
| `DELETE` | `/api/files/:id` | Delete a file |

## Authentication, Validation, and CSRF

The server uses Passport Local with bcrypt and `express-session`. Sessions are stored in PostgreSQL through `connect-pg-simple`, while only the user id is serialized into the session. Signup creates the user and their `root` folder in one Prisma transaction. Production cookies are HTTP-only, secure, and configured with `sameSite: "none"` for the deployed cross-origin client/API arrangement.

Login creates a random CSRF token in the session and returns it in the response. `/api/users/me` returns the same token when the session is reloaded. The client stores the token in memory and the shared Axios request interceptor sends it on `POST`, `PUT`, `PATCH`, and `DELETE` requests. The server checks it before authenticated mutations and returns `403` when it is missing or does not match.

Zod schemas validate auth bodies, folder bodies, UUID route parameters, and uploaded file objects. Invalid input returns `400` with flattened validation errors. Ownership checks are applied when reading or modifying user folders and files.

## Database and Storage

Prisma models `User`, `Folder`, and `File` in PostgreSQL. Users have unique email addresses. Folders support a per-user parent/child hierarchy and enforce unique names within a user and parent folder. Files store their original name, MIME type, size, owner, folder, and a unique `storageName` object key.

Apply the committed migrations to a database with:

```bash
npx prisma migrate deploy
```

For local schema development, create a named migration and regenerate the client:

```bash
npx prisma migrate dev --name <migration-name>
npm --workspace server run generate
```

Uploads are held in Multer memory storage, limited to 10 MiB, and sent to the configured S3-compatible bucket with a generated UUID key. The database row is created after the object upload; if row creation fails, the server makes a best-effort object cleanup. Reads return one-hour signed URLs.

Deleting a file removes its object first and then its database row. Deleting a folder first collects storage keys for the folder and all descendants, then deletes the folder row. PostgreSQL `ON DELETE CASCADE` foreign keys recursively remove descendant folder rows and their file metadata rows. The collected objects are then deleted from S3-compatible storage in bulk. Database cascade deletion and object cleanup are separate operations, so storage cleanup failures can leave orphaned objects.

## Testing

### Client

Client Vitest tests cover pages, `UserProvider`, schemas, helpers, API services, and React Router loaders. The current suite contains 27 test files and 100 tests. Playwright is configured for `client/tests/E2E` and currently lists 16 tests across seven files covering auth, theme, folders, file upload, file details, signed-link copying, and deletion.

```bash
npm --workspace client run test -- --run
npm --workspace client run test:e2e
```

The Playwright suite starts the Vite server through its config, but the API must already be available at `http://localhost:3000`; the database and S3-compatible storage must also be configured.

### Server

Server unit tests cover controllers, the folder deletion service, CSRF middleware, validation middleware, and Zod schemas. The current unit suite contains nine files and 111 tests. Supertest integration tests cover user, folder, and file routes in three files; they create database/storage fixtures and require the configured integration environment.

```bash
npm --workspace server run test -- --run "Tests/Unit Test"
npm --workspace server run test -- --run "Tests/Integration"
```

The latest verified integration run passes all three route suites: `userRoutes.test.js` (11 tests), `folderRoute.test.js` (14 tests), and `fileRoute.test.js` (15 tests), for 40 passing tests total. The folder suite includes verification that deleting a parent folder also deletes its child folder. Integration tests require the configured PostgreSQL database, S3-compatible storage, and committed file fixtures.

## CI/CD and Deployment

`.github/workflows/main.yml` runs on pushes, pull requests, and manual dispatches using Node 24. It installs from the root lockfile, installs Chromium for Playwright, runs client lint/tests/typecheck/build, generates Prisma, applies deployed migrations, runs server lint/unit/integration tests, starts the API, waits for `/health`, and runs the Playwright suite with one worker. Database, session, storage, and client API configuration are supplied through GitHub Actions secrets/variables.

The current production targets are Vercel for the frontend and Render for the backend. The repository contains `vercel.json`, which rewrites `/api/:path*` to `https://cloudstorage-odin.onrender.com/api/:path*` and all other paths to `/index.html` for client-side routing. No Render configuration file or deployment step is present in this repository; hosting-project settings are external to the codebase.

## Screenshots

![Login](screenshot/login.png)
![Signup](screenshot/signup.png)
![Folder creation](screenshot/folderCreation.png)
![File upload](screenshot/fileUpload.png)
![Empty drive](screenshot/emptyDrive.png)

## Future Improvements

Multiple-file uploads, drag-and-drop uploads, rename support, search, and a dedicated download action for all file types remain possible next steps.

## License

MIT
