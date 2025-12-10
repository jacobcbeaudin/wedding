# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vercel dev server
npm run build        # Build for production (Vite)
npm run check        # TypeScript type checking
npm run db:push      # Push Drizzle schema to database
npm run db:studio    # Open Drizzle Studio
npm test             # Run unit tests (watch mode)
npm run test:run     # Run unit tests (single run)
npm run test:e2e     # Run Playwright e2e tests
```

## Architecture

Wedding website deployed on Vercel with Neon PostgreSQL.

### Directory Structure

- `client/` - React frontend (Vite)
- `api/` - Vercel serverless functions
- `shared/` - Database schema, tRPC router, utilities
- `tests/` - Unit tests (Vitest) and e2e tests (Playwright)
- `attached_assets/` - Static images

### Path Aliases

- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

### Tech Stack

**Frontend:**

- React 18 with wouter for routing
- TanStack Query + tRPC for data fetching
- Tailwind CSS with shadcn/ui components

**Backend:**

- tRPC router in `shared/router.ts`
- Vercel serverless function at `api/trpc/[trpc].ts`
- Drizzle ORM with Neon PostgreSQL

**Infrastructure:**

- Vercel for hosting and serverless functions
- Neon for PostgreSQL database
- Upstash Redis for rate limiting
- Resend for transactional emails (planned)

### Key Files

- `shared/router.ts` - tRPC router with auth and rsvp procedures
- `shared/schema.ts` - Drizzle database schema and Zod validators
- `shared/sanitize.ts` - Input sanitization utilities
- `client/src/lib/trpc.ts` - tRPC client setup

### Testing

- Unit tests use `router.createCaller()` to test tRPC procedures directly
- Tests run against a test database (see `tests/setup.ts`)
- Pre-commit hooks run ESLint and Prettier via Husky

## Design Guidelines

The site follows a **coastal luxury aesthetic**:

- Typography: Cormorant Garamond (serif headings) + Montserrat (sans-serif body)
- Colors: Dusty Blue (#A8BCC9), Cream (#F5F1EA), Deep Navy (#2C3E50)
- Generous whitespace, subtle animations, photography-first design

## Environment Variables

```bash
DATABASE_URL=           # Neon PostgreSQL connection string
SITE_PASSWORD=          # Password for site access
UPSTASH_REDIS_REST_URL= # Upstash Redis URL (optional, for rate limiting)
UPSTASH_REDIS_REST_TOKEN= # Upstash Redis token
RESEND_API_KEY=         # Resend API key (for confirmation emails)
```
