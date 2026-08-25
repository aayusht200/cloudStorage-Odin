# Cloud Storage Odin Client

The client is a Vite React app for the Cloud Storage Odin drive UI. It handles authentication screens, protected drive routes, folder navigation, file upload forms, file previews, and theme switching.

## Tech Stack

- React 19, TypeScript, and React Router
- Vite with the React Compiler preset
- Tailwind CSS 4
- Axios with credentialed requests
- Base UI, shadcn-style primitives, Lucide, and Tabler icons
- Vitest, Testing Library, jsdom, and V8 coverage

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
| `npm test -- --coverage --run` | Run frontend tests with V8 coverage |

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

Frontend tests are organized under `client/tests`, with unit tests for schemas, helpers, services, and loaders, plus component tests for pages and UserProvider behavior.

| Area | Covered |
| --- | --- |
| Pages | `Login`, `SignupPage`, `DrivePage`, `FilesPage`, `UploadPage`, `CreateFolderPage`, `HomeRedirect`, `ErrorPage` |
| Context | `UserProvider` behavior |
| Zod schemas | `authSchema`, `fileSchema`, `folderSchema` |
| Helper functions | `getFileIcon` |
| API services | `authenticate`, `createFolder`, `deleteFile`, `deleteFolder`, `getFile`, `getFolder`, `login`, `logout`, `signup`, `upload` |
| React Router loaders | `authRedirectLoader`, `driveLoader`, `filesLoader`, `rootLoader` |

The tests use Vitest, Testing Library, jsdom, V8 coverage, Axios/service mocking, and React Router dependency mocking.

Latest verified frontend result:

| Metric | Coverage |
| --- | --- |
| Test files | 27 passed |
| Tests | 100 passed |
| Statements | 85.71% |
| Branches | 85.81% |
| Functions | 76.10% |
| Lines | 85.92% |

Pages, loaders, schemas, services, and helpers report 100% coverage in the latest coverage run. Overall frontend coverage is lower because UI infrastructure, third-party-derived UI primitives, and some context/provider branches remain partially uncovered.

### Testing Roadmap

Completed:

- Backend unit tests
- Backend integration tests
- Frontend tests for pages, UserProvider behavior, schemas, helpers, services, and loaders

Next:

- CI/CD
- Maintain coverage as new frontend features are added

## Deployment

The project includes `vercel.json` with a rewrite to `index.html` so browser refreshes work on client-side routes. Set `VITE_API_URL` in the deployment environment to the production API URL.
