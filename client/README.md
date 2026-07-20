# Client

The frontend package uses React, TypeScript, Vite, Tailwind CSS, and the React Compiler.

## Prerequisites

- Node.js and npm
- The API server configured and running; see [server/README.md](../server/README.md)

## Setup

From the repository root:

```bash
cd client
npm ci
```

## Start development

```bash
npm run dev
```

Vite prints the local URL when it starts. The default is `http://localhost:5173`.

## Available commands

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

The production build is written to `client/dist/`.

## Production preview

```bash
npm run build
npm run preview
```
