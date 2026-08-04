# Cloud Storage Odin Server

The server is an Express API for authentication, folders, file metadata, session persistence, Zod request validation, and S3-compatible file storage. It uses Prisma with PostgreSQL and stores sessions in PostgreSQL through `connect-pg-simple`.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Runtime | Node.js, Express 5 |
| Authentication | Passport local strategy, Express Session, bcrypt |
| Database | PostgreSQL, Prisma, `pg`, `connect-pg-simple` |
| Validation | Zod |
| Uploads and storage | Multer, AWS SDK S3 client, S3-compatible object storage |
| Testing | Vitest, V8 coverage |

## Project Structure

```text
server/
├── Tests/        # Vitest unit tests
├── config/       # Prisma, pg pool, Passport, Multer, and S3 client configuration
├── controller/   # User, folder, and file request handlers
├── middleware/   # Auth guards and reusable Zod validation middleware
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
| `npm test` | Run Vitest unit tests |
| `npm test -- --coverage --run` | Run Vitest with V8 coverage |

## API Routes

All drive routes require an authenticated session. Auth requests are validated before controller logic runs.

| Method | Path | Middleware | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/users/signup` | `validate(signupSchema)` | Create an account and root folder |
| `POST` | `/api/users/login` | `validate(loginSchema)` | Login with Passport |
| `POST` | `/api/users/logout` | `requireAuth` | Logout and clear the session cookie |
| `GET` | `/api/users/me` | `requireAuth` | Return the current user and root folder id |
| `POST` | `/api/folders/create` | `requireAuth`, `validate(createFolderSchema)` | Create a folder |
| `GET` | `/api/folders/:id` | `requireAuth`, `validate(idSchema, "params")` | Get a folder, children, files, and path |
| `DELETE` | `/api/folders/:id` | `requireAuth`, `validate(idSchema, "params")` | Delete a folder |
| `POST` | `/api/files/create` | `requireAuth`, `upload.single("file")`, `validate(createFileSchema, "file")` | Upload a file |
| `GET` | `/api/files/:id` | `requireAuth`, `validate(idSchema, "params")` | Get file metadata, path, and a signed URL |
| `DELETE` | `/api/files/:id` | `requireAuth`, `validate(idSchema, "params")` | Delete a file |

## Architecture

### Request Flow

Requests enter `app.js`, pass through CORS, JSON/form parsing, session handling, and Passport initialization. Mounted routers apply route-specific authentication, Multer upload parsing, and Zod validation before calling controllers. Controllers use Prisma and service helpers, then send JSON responses or pass unexpected errors to `next(error)`.

### Authentication Flow

Signup validates the body, checks for an existing email, hashes the password with bcrypt, and creates the user plus a `root` folder inside a Prisma transaction. Login uses Passport's local strategy with `email` as the username field, compares bcrypt hashes, removes the password from the session user, and stores the user id in the session. Logout calls `req.logout`, destroys the session, and clears `connect.sid`.

### Validation Flow

The reusable `validate(schema, target = "body")` middleware calls `schema.safeParse(req[target])`. Valid data replaces the original request target and continues to the controller. Invalid data returns `400` with flattened Zod errors. Routes currently validate auth bodies, folder bodies, route params, and uploaded file objects.

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

Vitest runs in a Node environment. Tests live in `server/Tests`.

| Test file | Coverage |
| --- | --- |
| `authSchema.test.js` | Login and signup schema validation, email rules, password complexity, trimming, and name validation |
| `folderSchema.test.js` | Folder name validation and parent UUID validation |
| `fileSchema.test.js` | File object validation, MIME types, size boundaries, Buffer validation, and id UUID validation |
| `validateMiddleware.test.js` | Body, params, and file validation success and failure paths |
| `userController.test.js` | Signup, login, logout, and current-user controller behavior |

Controller tests mock Prisma, bcrypt, Passport, request login/logout/session methods, and response helpers with `vi.mock` and `vi.fn`. Middleware tests use mock request, response, and `next` objects. Schema tests call Zod `parse` and `safeParse` directly.

Latest backend coverage report:

| Metric | Coverage |
| --- | --- |
| Statements | 100% |
| Branches | 100% |
| Functions | 100% |
| Lines | 100% |

## Production

Set all required environment variables in the hosting platform, set `NODE_ENV=production`, and run:

```bash
npm start
```

Production cookies use `secure: true` and `sameSite: "none"`, so the API must be served over HTTPS when used by the deployed frontend.
