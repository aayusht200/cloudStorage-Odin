# Cloud Storage Odin Server

[![Main CI](https://github.com/aayusht200/cloudStorage-Odin/actions/workflows/main.yml/badge.svg)](https://github.com/aayusht200/cloudStorage-Odin/actions/workflows/main.yml)

The server is an Express API for authentication, sessions, folder and file metadata, request validation, and S3-compatible object storage. It uses Prisma with PostgreSQL and stores Express sessions in PostgreSQL through `connect-pg-simple`.

See the [root README](../README.md) for the complete project overview and the client setup/deployment notes.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Runtime | Node.js 24, Express |
| Authentication | Passport Local, Express Session, bcrypt |
| Database | PostgreSQL, Prisma, `pg`, `connect-pg-simple` |
| Validation | Zod and reusable validation middleware |
| Security | Credentialed CORS, HTTP-only sessions, CSRF middleware |
| Uploads/storage | Multer memory storage, AWS SDK S3 client, S3-compatible object storage |
| Testing | Vitest, Supertest, V8 coverage |

## Project Structure

```text
server/
├── Tests/        # Unit tests and Supertest integration tests
├── config/       # PostgreSQL, Passport, Multer, and S3 configuration
├── controller/   # User, folder, and file handlers
├── middleware/   # Auth, CSRF, and Zod validation middleware
├── prisma/       # Prisma schema and migrations
├── routes/       # User, folder, and file routers
├── schema/       # Auth, folder, file, and UUID schemas
├── service/      # Storage, path, and recursive folder deletion helpers
├── app.js        # Express middleware, sessions, routes, health check, and errors
└── server.js     # HTTP listener
```

## Setup

Install dependencies from the repository root so npm uses the workspace lockfile:

```bash
cd ..
npm ci
```

Create `server/.env`:

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

Generate the Prisma client and apply the committed migrations:

```bash
npm run generate
npx prisma migrate deploy
```

For local schema development, create a named migration and regenerate the client:

```bash
npx prisma migrate dev --name <migration-name>
npm run generate
```

Keep `.env` out of version control. `DATABASE_URL` is used by Prisma and the PostgreSQL session pool. `NODE_ENV=production` enables secure cross-site cookies and PostgreSQL SSL configuration. CSRF tokens are generated in sessions and do not require an environment variable.

## Development

```bash
npm run dev
```

Nodemon starts `server.js`. With the default port, the API is available at `http://localhost:3000`; the unauthenticated health endpoint is `GET /health`.

The API allows credentialed requests from `http://localhost:5173`, `http://localhost:4173`, and matching `https://cloud-storage-odin*.vercel.app` origins.

## Scripts

Run these from `server/`, or prefix them with `npm --workspace server` from the repository root.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API with Node |
| `npm run generate` | Generate the Prisma client |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest in watch mode |
| `npm test -- --run "Tests/Unit Test"` | Run unit tests once |
| `npm test -- --run "Tests/Integration"` | Run integration tests once |
| `npm run coverage` | Run the server suite with V8 coverage |

## API Routes

The API is mounted under `/api`. `requireAuth` protects user session lookup and all folder/file routes. `csrfVerification` protects authenticated state-changing routes. Zod validation runs before controllers for auth bodies, folder bodies, UUID route parameters, and uploaded file objects.

| Method | Path | Middleware | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | — | Return `{ "status": "ok" }` |
| `POST` | `/api/users/signup` | `validate(signupSchema)` | Create a user and root folder |
| `POST` | `/api/users/login` | `validate(loginSchema)` | Authenticate and return a CSRF token |
| `POST` | `/api/users/logout` | `requireAuth`, `csrfVerification` | Destroy the session and clear `connect.sid` |
| `GET` | `/api/users/me` | `requireAuth` | Return the current user, root folder id, and CSRF token |
| `POST` | `/api/folders/create` | `requireAuth`, `csrfVerification`, `validate(createFolderSchema)` | Create a folder |
| `GET` | `/api/folders/:id` | `requireAuth`, `validate(idSchema, "params")` | Return folder contents and path |
| `DELETE` | `/api/folders/:id` | `requireAuth`, `csrfVerification`, `validate(idSchema, "params")` | Delete a folder recursively |
| `POST` | `/api/files/create` | `requireAuth`, `csrfVerification`, Multer, `validate(createFileSchema, "file")` | Upload a file |
| `GET` | `/api/files/:id` | `requireAuth`, `validate(idSchema, "params")` | Return metadata, path, and a signed URL |
| `DELETE` | `/api/files/:id` | `requireAuth`, `csrfVerification`, `validate(idSchema, "params")` | Delete a file |

## Architecture and Security

Requests enter `app.js` and pass through CORS, JSON/form parsing, Express sessions, and Passport. Routers apply route-specific auth, CSRF, Multer, and Zod middleware before controllers. Controllers use Prisma and storage/path services, return expected HTTP errors, or pass unexpected errors to the centralized error handler.

Passport Local authenticates by email and bcrypt password hash. Signup creates the user and `root` folder in a Prisma transaction. Only the user id is serialized into the session; user responses omit the password. Sessions are PostgreSQL-backed and cookies are HTTP-only.

Login creates a random CSRF token in the session and returns it. `/api/users/me` returns it for session hydration. The client sends it in `x-csrf-token` on mutation requests. The CSRF middleware compares the header with the session token and returns `403` on a mismatch or missing token.

The reusable `validate` middleware calls `safeParse` for the selected request target and replaces valid input with parsed data. Invalid input returns `400` with flattened Zod errors. Ownership is enforced by filtering folder/file queries by the authenticated user id.

## Database

The Prisma schema defines:

| Model | Responsibility |
| --- | --- |
| `User` | Account details, password hash, role, folders, and files |
| `Folder` | Per-user folders with an optional parent folder |
| `File` | Object key, original metadata, owner, and folder relation |

Important constraints include unique user email, unique folder name per `userId`/`parentId`, unique `File.storageName`, and UUID identifiers. The folder self-relation and file-to-folder relation use `onDelete: Cascade`. The committed migration `20260907_folder_delete_cascade` applies the corresponding PostgreSQL `ON DELETE CASCADE` foreign keys.

`prisma migrate deploy` applies committed migrations in deployment/CI environments. `prisma migrate dev --name <migration-name>` is for creating and applying a development migration after editing `prisma/schema.prisma`.

## File Storage and Deletion

Multer uses in-memory uploads with a 10 MiB limit. The S3 client uses `S3_ENDPOINT`, `S3_REGION`, access-key credentials, and `S3_BUCKET_NAME`, with generated UUID object keys. The effective route-level MIME types are the types accepted by both Multer and the Zod schema: PNG, JPEG, PDF, MPEG audio, and MP4 video. The code currently has a MIME-list mismatch: Multer also allows `text/plain`, while the Zod schema also lists `image/webp`; those two types do not pass both layers.

The `File.storageName` database value is the object key, not a public URL. File reads generate one-hour signed URLs. Direct file deletion removes the object before deleting the database row.

Folder deletion collects object keys from the selected folder and all descendants, deletes the selected database folder, and relies on PostgreSQL cascade rules to remove descendant folder rows and file metadata rows. It then bulk-deletes the collected objects from S3-compatible storage. The database cascade and object deletion are separate operations; storage failures can therefore leave orphaned objects and require a future cleanup/transaction strategy decision.

## Testing

Unit tests are in `server/Tests/Unit Test`; integration tests are in `server/Tests/Integration`.

| Test type | Current inventory |
| --- | --- |
| Unit | 9 files, 111 tests covering controllers, recursive deletion, CSRF, validation middleware, and schemas |
| Integration | 3 route files and 40 passing tests covering user, folder, and file HTTP flows, including auth, validation, upload, deletion, ownership, and cascade behavior |

Run the suites separately:

```bash
npm test -- --run "Tests/Unit Test"
npm test -- --run "Tests/Integration"
```

The latest verified integration run passes `userRoutes.test.js` (11 tests), `folderRoute.test.js` (14 tests), and `fileRoute.test.js` (15 tests), for 40 passing tests total. The folder suite includes verification that deleting a parent folder also deletes its child folder. Integration tests create database users/folders/files and S3-compatible fixtures, then clean up test data. They require a reachable PostgreSQL database, session secret, S3-compatible storage configuration, and the committed file fixtures. The CI workflow generates Prisma, applies migrations, runs unit and integration tests, then starts the API for client E2E tests.

## Production and Deployment

The backend production target is Render. Set all server environment variables in the hosting platform and run:

```bash
npm start
```

Production cookies use `secure: true` and `sameSite: "none"`, so the API must be served over HTTPS for the deployed cross-origin client. The repository has no `render.yaml` or deployment workflow; Render service settings are external to this repository. GitHub Actions provides CI checks, not deployment automation.
