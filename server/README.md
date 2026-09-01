# Cloud Storage Odin Server

[![Main CI](https://github.com/aayusht200/cloudStorage-Odin/actions/workflows/main.yml/badge.svg)](https://github.com/aayusht200/cloudStorage-Odin/actions/workflows/main.yml)

The server is an Express API for authentication, folders, file metadata, session persistence, Zod request validation, and S3-compatible file storage. It uses Prisma with PostgreSQL and stores sessions in PostgreSQL through `connect-pg-simple`.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Runtime | Node.js, Express 5 |
| Authentication | Passport local strategy, Express Session, bcrypt |
| Database | PostgreSQL, Prisma, `pg`, `connect-pg-simple` |
| Validation | Zod |
| Security | Credentialed CORS, CSRF middleware |
| Uploads and storage | Multer, AWS SDK S3 client, S3-compatible object storage |
| Testing | Vitest, Supertest, V8 coverage |

## Project Structure

```text
server/
├── Tests/        # Vitest unit tests and Supertest integration tests
├── config/       # Prisma, pg pool, Passport, Multer, and S3 client configuration
├── controller/   # User, folder, and file request handlers
├── middleware/   # Auth guards, CSRF verification, and reusable Zod validation middleware
├── prisma/       # Prisma schema and migrations
├── routes/       # Express route definitions
├── schema/       # Zod schemas for auth, folders, files, and route ids
├── service/      # Storage helpers and folder path generation
├── app.js        # Express app, sessions, CORS, routes, and error handling
└── server.js     # HTTP listener
```

## Setup

Install dependencies from this directory:

```bash
npm ci
```

Create `server/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
SESSION_SECRET="replace-with-a-long-random-string"
PORT=3000
NODE_ENV=development

S3_REGION="your-region"
S3_ENDPOINT="https://your-s3-compatible-endpoint"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-key"
S3_BUCKET_NAME="your-bucket"
```

Generate the Prisma client after installing dependencies:

```bash
npm run generate
```

Apply existing migrations to a local database:

```bash
npx prisma migrate dev
```

Keep `.env` out of version control.

## Development

```bash
npm run dev
```

Nodemon starts `server.js` and restarts the API when source files change. With the default port, the API runs at `http://localhost:3000`.

The app allows credentialed CORS requests from `http://localhost:5173`, `http://localhost:4173`, and matching `https://cloud-storage-odin*.vercel.app` deployments.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API with Node |
| `npm run generate` | Generate the Prisma client |
| `npm run lint` | Run ESLint |
| `npm test` | Run backend Vitest tests |
| `npm run coverage` | Run Vitest with V8 coverage |

## API Routes

All drive routes require an authenticated session. Auth requests are validated before controller logic runs. Authenticated state-changing routes also require the session CSRF token in the `x-csrf-token` header.

| Method | Path | Middleware | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/users/signup` | `validate(signupSchema)` | Create an account and root folder |
| `POST` | `/api/users/login` | `validate(loginSchema)` | Login with Passport and return a CSRF token |
| `POST` | `/api/users/logout` | `requireAuth`, `csrfVerification` | Logout and clear the session cookie |
| `GET` | `/api/users/me` | `requireAuth` | Return the current user, root folder id, and CSRF token |
| `POST` | `/api/folders/create` | `requireAuth`, `csrfVerification`, `validate(createFolderSchema)` | Create a folder |
| `GET` | `/api/folders/:id` | `requireAuth`, `validate(idSchema, "params")` | Get a folder, children, files, and path |
| `DELETE` | `/api/folders/:id` | `requireAuth`, `csrfVerification`, `validate(idSchema, "params")` | Delete a folder |
| `POST` | `/api/files/create` | `requireAuth`, `csrfVerification`, `upload.single("file")`, `validate(createFileSchema, "file")` | Upload a file |
| `GET` | `/api/files/:id` | `requireAuth`, `validate(idSchema, "params")` | Get file metadata, path, and a signed URL |
| `DELETE` | `/api/files/:id` | `requireAuth`, `csrfVerification`, `validate(idSchema, "params")` | Delete a file |

## Architecture

### Request Flow

Requests enter `app.js`, pass through CORS, JSON/form parsing, session handling, and Passport initialization. Mounted routers apply route-specific authentication, CSRF verification for state-changing authenticated requests, Multer upload parsing, and Zod validation before calling controllers. Controllers use Prisma and service helpers, then send JSON responses or pass unexpected errors to `next(error)`.

### Authentication Flow

Signup validates the body, checks for an existing email, hashes the password with bcrypt, and creates the user plus a `root` folder inside a Prisma transaction. Login uses Passport's local strategy with `email` as the username field, compares bcrypt hashes, removes the password from the session user, stores the user id and CSRF token in the session, and saves the session before responding. `/api/users/me` returns the current user, root folder id, and session CSRF token. Logout verifies the CSRF token, calls `req.logout`, destroys the session, and clears `connect.sid`.

### CSRF Flow

Login creates a random session CSRF token and returns it to the client. `/api/users/me` also returns the current session token so an already-authenticated browser can refresh client state. The frontend sends that value as `x-csrf-token` on `POST`, `PUT`, `PATCH`, and `DELETE` requests through the shared Axios client. The `csrfVerification` middleware rejects mismatched or missing tokens with `403`.

### Validation Flow

The reusable `validate(schema, target = "body")` middleware calls `schema.safeParse(req[target])`. Valid data replaces the original request target and continues to the controller. Invalid data returns `400` with flattened Zod errors. Routes currently validate auth bodies, folder bodies, route params, and uploaded file objects. CSRF validation is separate from Zod validation and runs before controllers on authenticated mutation routes.

### Error Handling Flow

Controllers return expected errors directly, including `400`, `401`, `404`, `409`, and selected `500` responses. Unexpected errors are passed to the centralized Express error handler, which logs the error and returns `{ message }` with `err.status || 500`. Unknown routes return `404` with `{ message: "Invalid route" }`.

## Database

The Prisma schema defines users, nested folders, and files:

| Model | Purpose |
| --- | --- |
| `User` | Account details, password hash, role, folders, and files |
| `Folder` | Per-user folders with optional parent-child hierarchy |
| `File` | Stored object key, original metadata, MIME type, size, owner, and folder |

Important constraints:

- `User.email` is unique.
- `Folder` enforces unique `folderName` per `userId` and `parentId`.
- `File.storageName` is unique.
- Signup uses `prisma.$transaction` to create the user and root folder together.

After changing `prisma/schema.prisma`, create and apply a migration:

```bash
npx prisma migrate dev --name <migration-name>
npm run generate
```

## Storage

Uploads use Multer memory storage with a 10 MB file size limit. The S3 client is configured with `forcePathStyle: true`, custom endpoint credentials, and `S3_BUCKET_NAME`. Uploaded objects use generated UUID keys. File reads generate signed URLs with a one-hour expiry. File deletion removes the object from storage before deleting the database row.

Multer currently accepts `image/png`, `image/jpeg`, `application/pdf`, `audio/mpeg`, `video/mp4`, and `text/plain`. The Zod file schema currently accepts `image/png`, `image/jpeg`, `image/webp`, `application/pdf`, `audio/mpeg`, and `video/mp4`.

## Testing

Vitest runs in a Node environment. Tests live in `server/Tests`, with unit tests under `server/Tests/Unit Test` and HTTP integration tests under `server/Tests/Integration`.

| Test file | Coverage |
| --- | --- |
| `authSchema.test.js` | Login and signup schema validation, email rules, password complexity, trimming, and name validation |
| `csrfMiddleware.test.js` | Valid, invalid, and missing CSRF token handling |
| `folderSchema.test.js` | Folder name validation and parent UUID validation |
| `fileSchema.test.js` | File object validation, MIME types, size boundaries, Buffer validation, and id UUID validation |
| `validateMiddleware.test.js` | Body, params, and file validation success and failure paths |
| `userController.test.js` | Signup, login, logout, and current-user controller behavior |
| `folderController.test.js` | Folder creation, retrieval, deletion, ownership, duplicates, and missing-folder paths |
| `fileController.test.js` | File upload, retrieval, signed URL behavior, deletion, ownership, and missing-file paths |
| `userRoutes.test.js` | Signup, login/session behavior, `/me`, logout, validation failures, and unauthenticated requests |
| `folderRoute.test.js` | Authenticated folder create/read/delete flows, validation failures, duplicates, and missing folders |
| `fileRoute.test.js` | Authenticated file upload/read/delete flows, validation failures, file type handling, and missing files |

Controller tests mock Prisma, bcrypt, Passport, request login/logout/session methods, response helpers, and storage helpers with `vi.mock` and `vi.fn`. Middleware tests use mock request, response, and `next` objects for CSRF and Zod validation behavior. Schema tests call Zod `parse` and `safeParse` directly. Integration tests use Supertest, including `request.agent(app)` where session and cookie persistence is required.

Integration tests create their required users, folders, files, and uploaded S3-compatible storage objects where needed. Shared utilities in `server/Tests/Integration/testUtils.js` provide fixture creation, authenticated agent setup, and cleanup so tests do not depend on manually persisted development database records.

The integration suite still requires a configured and reachable test/development database, a configured and reachable S3-compatible storage environment, and the existing upload fixture file used by the file route tests.

Latest verified backend result:

| Metric | Result |
| --- | --- |
| Test files | 11 passed |
| Tests | 143 passed |
| Statements | 95.13% |
| Branches | 80% |
| Functions | 90.62% |
| Lines | 94.88% |

GitHub Actions runs Prisma client generation, database migrations, server lint, unit tests, and integration tests as part of the repository `Main CI` workflow.

## Production

Set all required environment variables in the hosting platform, set `NODE_ENV=production`, and run:

```bash
npm start
```

Production cookies use `secure: true` and `sameSite: "none"`, so the API must be served over HTTPS when used by the deployed frontend.

The server is deployed on Render with Supabase PostgreSQL and S3-compatible storage configured through environment variables. Deployment is handled by the connected Render service, while GitHub Actions provides CI checks.
