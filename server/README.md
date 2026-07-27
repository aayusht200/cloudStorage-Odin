# Cloud Storage Odin Server

The server is an Express API for authentication, folders, file metadata, session persistence, and S3-compatible file storage. It uses Prisma with PostgreSQL and stores sessions in PostgreSQL through `connect-pg-simple`.

## Tech Stack

- Node.js and Express 5
- Passport local authentication
- Express Session with PostgreSQL session storage
- Prisma and PostgreSQL
- Multer for upload parsing
- AWS SDK S3 client for S3-compatible object storage

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
npx prisma generate
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

The app currently allows credentialed CORS requests from `http://localhost:5173` and matching `https://cloud-storage-odin*.vercel.app` deployments.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API with Node |
| `npm test` | Placeholder only; no test suite is configured yet |

## API Routes

All routes that read or modify drive data require an authenticated session.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/users/signup` | Create an account |
| `POST` | `/api/users/login` | Login with Passport |
| `POST` | `/api/users/logout` | Logout the current session |
| `GET` | `/api/users/me` | Return the current user |
| `POST` | `/api/folders/create` | Create a folder |
| `GET` | `/api/folders/:id` | Get a folder and its contents |
| `DELETE` | `/api/folders/:id` | Delete a folder |
| `POST` | `/api/files/create` | Upload a file |
| `GET` | `/api/files/:id` | Get file metadata and access URL |
| `DELETE` | `/api/files/:id` | Delete a file |

## Database

The Prisma schema defines users, nested folders, and files:

- `User`: account details, password hash, role, folders, and files
- `Folder`: per-user folder names with optional parent folder hierarchy
- `File`: storage object name, original name, MIME type, size, owner, and folder

After changing `prisma/schema.prisma`, create and apply a migration:

```bash
npx prisma migrate dev --name <migration-name>
npx prisma generate
```

## Production

Set all required environment variables in the hosting platform, set `NODE_ENV=production`, and run:

```bash
npm start
```

Production cookies use `secure: true` and `sameSite: "none"`, so the API must be served over HTTPS when used by the deployed frontend.
