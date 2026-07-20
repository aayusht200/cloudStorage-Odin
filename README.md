# Full-Stack Monorepo Template

A GitHub-ready starter repository with a React client and an Express server.

## Repository structure

```text
.
├── client/   # React, TypeScript, Vite, and Tailwind CSS
└── server/   # Express, Prisma, and PostgreSQL
```

The client and server are separate npm projects. Install and run them from their respective directories.

## Prerequisites

- Node.js and npm
- PostgreSQL, either locally or from a hosted provider

## Setup

1. Clone the repository and enter it:

   ```bash
   git clone <repository-url>
   cd fullstack-monorepo-template
   ```

2. Install the client dependencies:

   ```bash
   cd client
   npm ci
   cd ..
   ```

3. Install the server dependencies:

   ```bash
   cd server
   npm ci
   ```

4. Create `server/.env` and add the server configuration:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
   PORT=3000
   ORIGIN="http://localhost:5173"
   ```

5. Generate the Prisma client:

   ```bash
   npx prisma generate
   cd ..
   ```

Keep `.env` out of version control. If the Prisma schema gains database models, create and apply a development migration from `server/` with `npx prisma migrate dev`.

## Start the application

Run the server in one terminal:

```bash
cd server
npm run dev
```

Run the client in a second terminal:

```bash
cd client
npm run dev
```

By default:

- Client: `http://localhost:5173`
- Server: `http://localhost:3000`

## Production commands

Build and preview the client:

```bash
cd client
npm run build
npm run preview
```

Start the server without file watching:

```bash
cd server
npm start
```

See [client/README.md](client/README.md) and [server/README.md](server/README.md) for package-specific details.
