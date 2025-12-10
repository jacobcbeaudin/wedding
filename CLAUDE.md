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
- `api/trpc/[trpc].ts` - tRPC API handler (all backend code inlined)
- `drizzle/schema.ts` - Database schema for Drizzle Kit migrations
- `tests/` - Unit tests (Vitest) and e2e tests (Playwright)
- `attached_assets/` - Static images

### Path Aliases

- `@/` → `client/src/`
- `@assets/` → `attached_assets/`

### Tech Stack

**Frontend:**

- React 18 with wouter for routing
- TanStack Query + tRPC for data fetching
- Tailwind CSS with shadcn/ui components

**Backend:**

- tRPC router in `api/lib/router.ts`
- Vercel serverless function at `api/trpc/[trpc].ts`
- Drizzle ORM with Neon PostgreSQL

**Infrastructure:**

- Vercel for hosting and serverless functions
- Neon for PostgreSQL database
- Upstash Redis for rate limiting
- Resend for transactional emails (planned)

### Key Files

- `api/trpc/[trpc].ts` - All backend code (router, schema, db, validation, utilities)
- `drizzle/schema.ts` - Database schema for migrations (kept in sync with handler)
- `client/src/lib/trpc.ts` - tRPC client setup

### Testing

- Unit tests use `router.createCaller()` to test tRPC procedures directly
- Tests run against a test database (see `tests/setup.ts`)
- Pre-commit hooks run ESLint and Prettier via Husky

## Design Guidelines

The site follows a **coastal luxury aesthetic** with light/dark mode support.

### Typography

- **Primary font:** Forum (serif) - used for both headings and body via `font-sans`/`font-serif`
- **Script font:** Great Vibes - for decorative accents (`.script-font`)
- **Utility classes:** `.elegant-serif`, `.letter-spacing-wide`

### Color Palette (HSL values in CSS variables)

| Token | Light Mode | Usage |
|-------|------------|-------|
| `--primary` | `205 20% 65%` (Dusty Blue) | Buttons, links, accents |
| `--background` | `40 25% 98%` (Warm Cream) | Page background |
| `--foreground` | `210 20% 20%` (Deep Navy) | Primary text |
| `--card` | `40 30% 96%` | Card backgrounds |
| `--muted` | `40 20% 92%` | Subtle backgrounds |
| `--muted-foreground` | `210 15% 45%` | Secondary text |

### Custom Utilities

- `.coastal-shadow` - Soft blue-tinted shadow: `box-shadow: 0 4px 20px rgba(168, 188, 201, 0.15)`
- `.fade-in-up` - Entrance animation (0.6s ease-out)
- `.hover-elevate` / `.active-elevate-2` - Interactive brightness adjustment

### Design Principles

- Generous whitespace with `container mx-auto max-w-4xl px-6 py-20` pattern
- Cards use `.coastal-shadow` and `border-0` for soft, floating appearance
- Subtle animations on page transitions and interactions
- Photography-first layout on hero sections

## Environment Variables

```bash
DATABASE_URL=           # Neon PostgreSQL connection string
SITE_PASSWORD=          # Password for site access
UPSTASH_REDIS_REST_URL= # Upstash Redis URL (optional, for rate limiting)
UPSTASH_REDIS_REST_TOKEN= # Upstash Redis token
RESEND_API_KEY=         # Resend API key (for confirmation emails)
```
