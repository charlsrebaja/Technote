# Technote Logbook System

STEP 1 setup is complete with the following stack:

- Next.js (App Router) + TypeScript
- TailwindCSS
- shadcn/ui
- Prisma ORM
- PostgreSQL (NeonDB-ready)

## Requirements

- Node.js 20+
- npm 10+
- NeonDB connection string

## Environment Setup

1. Copy `.env.example` to `.env`
2. Update `DATABASE_URL` with your Neon connection string

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@EP-XXXX-XXXX.ap-southeast-1.aws.neon.tech/technote?sslmode=require"
```

## Install and Run

```bash
npm install
npm run prisma:generate
npm run dev
```

Open http://localhost:3000

## Useful Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run lint` - run ESLint
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - run Prisma migration in development
- `npm run db:push` - sync schema without migration files
- `npm run prisma:studio` - open Prisma Studio
