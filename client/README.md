# Cloud Storage Odin Client

The client is a Vite React app for the Cloud Storage Odin drive UI. It handles authentication screens, protected drive routes, folder navigation, file upload forms, file previews, and theme switching.

## Tech Stack

- React 19, TypeScript, and React Router
- Vite with the React Compiler preset
- Tailwind CSS 4
- Axios with credentialed requests
- Base UI, shadcn-style primitives, Lucide, and Tabler icons

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
| `npm run preview` | Preview the production build locally |

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

## Deployment

The project includes `vercel.json` with a rewrite to `index.html` so browser refreshes work on client-side routes. Set `VITE_API_URL` in the deployment environment to the production API URL.
