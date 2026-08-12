# Cloud Storage Odin Client

The client is a Vite React app for the Cloud Storage Odin drive UI. It handles authentication screens, protected drive routes, folder navigation, file upload forms, file previews, and theme switching.

## Tech Stack

- React 19, TypeScript, and React Router
- Vite with the React Compiler preset
- Tailwind CSS 4
- Axios with credentialed requests
- Base UI, shadcn-style primitives, Lucide, and Tabler icons
- Vitest with V8 coverage

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
| `npm test` | Run frontend Vitest tests |
| `npm test -- --coverage --run --environment node` | Run current non-React frontend unit tests with coverage |

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

## Testing

Frontend unit testing is complete for the current non-React application logic. Tests are organized under `client/tests/Unit Tests`.

| Area | Covered |
| --- | --- |
| Zod schemas | `authSchema`, `fileSchema`, `folderSchema` |
| Helper functions | `getFileIcon` |
| API services | `authenticate`, `createFolder`, `deleteFile`, `deleteFolder`, `getFile`, `getFolder`, `login`, `logout`, `signup`, `upload` |
| React Router loaders | `authRedirectLoader`, `driveLoader`, `filesLoader`, `rootLoader` |

The tests use Vitest, V8 coverage, Axios/service mocking, and React Router dependency mocking.

Current coverage for the tested source areas:

| Metric | Coverage |
| --- | --- |
| Statements | 100% |
| Branches | 100% |
| Functions | 100% |
| Lines | 100% |

This does not represent complete frontend coverage. React components, context/providers, pages, and router-level integration tests are not covered yet.

### Testing Roadmap

Completed:

- Backend unit tests
- Backend integration tests
- Frontend unit tests for schemas, helpers, services, and loaders

Next:

- UserProvider/context testing
- React component testing
- Page-level testing
- Frontend integration/router testing
- CI/CD

## Deployment

The project includes `vercel.json` with a rewrite to `index.html` so browser refreshes work on client-side routes. Set `VITE_API_URL` in the deployment environment to the production API URL.
