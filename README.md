# Cloud Storage --- Project Documentation

## Overview

Cloud Storage is a full-stack file management application that allows
authenticated users to organize, upload, manage, and share files.

The project is built using a React frontend and an Express backend with
Prisma ORM and PostgreSQL. Authentication is session-based using
Passport.js.

The application begins by storing uploaded files locally during
development and later transitions to cloud storage for production.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend

- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Passport.js
- express-session
- connect-pg-simple
- Multer

### Storage

- Development: Supabase Storage
- Production: Supabase Storage

## Core Features

- User registration and login
- Session-based authentication
- Folder CRUD
- File upload
- File download
- File deletion
- File metadata
- Cloud storage integration
- Folder sharing with expiring links

## Development Roadmap

### Phase 1

- [x] Project setup
- [x] Express
- [x] Prisma
- [x] Passport
- [x] Session authentication

### Phase 2

- [x] User model
- [x] Folder model
- [x] File model

### Phase 3

- [ ] Folder CRUD

### Phase 4

- [ ] Local uploads with Multer

### Phase 5

- [ ] File management

### Phase 6

- [ ] Validation

### Phase 7

- [ ] Supabase integration

### Phase 8

- [ ] Folder sharing

## Suggested Server Structure

```text
server
├── config
│   ├── passport.ts
│   ├── prisma.ts
│   └── multer.ts
├── controllers
├── middleware
├── prisma
├── routes
├── uploads
└── generated
```

## Database Models

### User

- id
- username
- password
- createdAt

### Folder

- id
- name
- createdAt
- updatedAt
- ownerId

### File

- id
- originalName
- filename
- mimeType
- size
- url
- createdAt
- folderId

### Share (Optional)

- id
- token
- expiresAt
- folderId

## Routes

### Authentication

```http
POST /register
POST /login
POST /logout
```

### Folders

```http
GET    /folders
GET    /folders/:id
POST   /folders
PATCH  /folders/:id
DELETE /folders/:id
```

### Files

```http
POST   /folders/:id/files
GET    /files/:id
GET    /files/:id/download
DELETE /files/:id
```

### Sharing

```http
POST /folders/:id/share
GET  /share/:token
```

## Future Improvements

- Drag-and-drop uploads
- Multiple file uploads
- Search
- Image previews
- Storage dashboard
- User quotas
- Activity log
