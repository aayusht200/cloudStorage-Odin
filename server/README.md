# Server

The backend package uses Express, Prisma, and PostgreSQL. It runs as an ES module application with Nodemon for local development.

## Prerequisites

- Node.js and npm
- A PostgreSQL database

## Setup

1. Install dependencies from the repository root:

   ```bash
   cd server
   npm ci
   ```

2. Create `server/.env`:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
   PORT=3000
   ORIGIN="http://localhost:5173"
   ```

   - `DATABASE_URL` is the PostgreSQL connection string used by Prisma.
   - `PORT` is optional and defaults to `3000`.
   - `ORIGIN` should match the client URL so credentialed cross-origin requests are allowed.

3. Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

Keep `.env` out of version control.

## Database changes

After adding or changing models in `prisma/schema.prisma`, create and apply a development migration:

```bash
npx prisma migrate dev --name <migration-name>
npx prisma generate
```

## Start development

```bash
npm run dev
```

Nodemon restarts the server when source files change. With the default configuration, the API is available at `http://localhost:3000`.

To verify it is running:

```bash
curl http://localhost:3000/
```

The root endpoint responds with `hello world`.

## Production start

Provide the production environment variables through the hosting platform or process environment, then run:

```bash
npm start
```

The production process does not load `server/.env` automatically.
