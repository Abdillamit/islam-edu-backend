# islam-edu-backend

Scalable MVP backend for an Islamic education app (Kyrgyzstan) using:
- NestJS (TypeScript)
- PostgreSQL
- Prisma ORM
- JWT admin authentication

This service is educational content-only (no fatwa generation, no AI chat).

## Core modules
- `admin-auth`: admin login + JWT
- `categories`: public localized read + protected CRUD
- `lessons`: public localized read/search + protected CRUD
- `progress`: guest completion tracking via `X-Device-Id`
- `bookmarks`: guest bookmarks via `X-Device-Id`
- `health`: uptime endpoint

## Localization model
- Supported languages: `ky`, `ru`
- Public endpoints accept `?lang=ky|ru`
- Missing translation fallback: `ru`

## Quick start
```bash
npm install
cp .env.example .env
npm run prisma:generate
npx prisma migrate deploy
npm run prisma:seed
npm run start:dev
```

## Admin auth
`POST /admin/auth/login`

Seeded default credentials:
- email: `admin@islamedu.kg`
- password: `Admin123!`

Change these values in `.env` before production.

## Public API (MVP)
- `GET /categories?lang=ky`
- `GET /categories/:id?lang=ru`
- `GET /lessons?categoryId=<uuid>&lang=ky&page=1&limit=20`
- `GET /lessons/featured?lang=ru`
- `GET /lessons/search?q=...&lang=ky`
- `GET /lessons/:id?lang=ky`
- `POST /progress/complete` (`X-Device-Id` header)
- `GET /progress/completed?lang=ru` (`X-Device-Id` header)
- `GET /progress/summary?lang=ky` (`X-Device-Id` header)
- `GET /bookmarks?lang=ky` (`X-Device-Id` header)
- `POST /bookmarks` (`X-Device-Id` header)
- `DELETE /bookmarks/:lessonId` (`X-Device-Id` header)

## Admin API (JWT required)
- `GET /admin/categories`
- `POST /admin/categories`
- `PATCH /admin/categories/:id`
- `PUT /admin/categories/:id/translations/:lang`
- `DELETE /admin/categories/:id`
- `GET /admin/lessons`
- `POST /admin/lessons`
- `PATCH /admin/lessons/:id`
- `PUT /admin/lessons/:id/translations/:lang`
- `DELETE /admin/lessons/:id`

## Development commands
```bash
npm run lint
npm run test
npm run test:e2e
```

## Git workflow
- Branch from `main` using `feat/*`, `fix/*`, `chore/*`
- Conventional Commits for all changes
- Merge to `main` through pull requests
