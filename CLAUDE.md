# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # TypeScript type checking
npm run lint         # Run ESLint
npm run db:push      # Push Drizzle schema to database
npm run db:studio    # Open Drizzle Studio
npm test             # Run unit tests (watch mode)
npm run test:run     # Run unit tests (single run)
npm run test:e2e     # Run Playwright e2e tests
```

## Architecture

Wedding website built with Next.js 15 App Router, deployed on Vercel with Neon PostgreSQL. Full-stack TypeScript with end-to-end type safety via tRPC.

### Directory Structure

```
wedding/
├── app/                    # Next.js App Router
│   ├── api/trpc/[trpc]/   # tRPC API route handler
│   ├── layout.tsx         # Root layout with providers
│   ├── globals.css        # Global styles + Tailwind
│   └── [page]/page.tsx    # Page components
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── providers/         # Context providers (tRPC)
│   └── *.tsx              # Feature components
├── lib/
│   ├── db/                # Database (single source of truth)
│   │   ├── schema.ts      # Drizzle schema
│   │   └── index.ts       # DB connection
│   ├── trpc/              # tRPC backend
│   │   ├── router.ts      # Root router
│   │   ├── routers/       # Procedure routers
│   │   ├── context.ts     # Request context
│   │   ├── init.ts        # tRPC initialization
│   │   └── utils.ts       # Backend utilities
│   ├── validations/       # Zod schemas (shared)
│   └── utils.ts           # cn() for Tailwind
├── hooks/                 # Custom React hooks
├── public/                # Static assets
│   └── images/            # Optimized images
└── tests/
    ├── unit/              # Vitest unit tests
    └── e2e/               # Playwright e2e tests
```

### Path Aliases

- `@/*` -> `./*` (project root)

### Tech Stack

**Frontend:**
- Next.js 15 App Router with React Server Components
- React 18 with `'use client'` for interactive components
- TanStack Query + tRPC React for type-safe data fetching
- Tailwind CSS + shadcn/ui component library

**Backend:**
- tRPC v11 with fetch adapter for Next.js
- Drizzle ORM with Neon PostgreSQL (serverless)
- Zod for runtime validation (shared with frontend)

**Infrastructure:**
- Vercel for hosting and edge functions
- Neon for serverless PostgreSQL
- Upstash Redis for rate limiting

### Database Schema (Relational)

```
parties (1) ←→ (N) guests
parties (1) ←→ (N) invitations
events  (1) ←→ (N) invitations
guests  (1) ←→ (N) rsvps
events  (1) ←→ (N) rsvps
guests  (1) ←→ (N) song_requests
```

- **parties** - Households/groups that receive invitations together
- **guests** - Individual people belonging to a party
- **events** - Wedding events (tea ceremony, welcome party, wedding)
- **invitations** - Which parties are invited to which events
- **rsvps** - Individual guest responses per event
- **song_requests** - Songs requested by guests (tracks who requested)

### Key Patterns

**Type Safety Flow:**

```text
Zod Schema (lib/validations/)
    → tRPC Procedure (lib/trpc/routers/)
    → tRPC Client (components/providers/)
    → React Component (app/)
```

**Server vs Client Components:**

- Pages in `app/` use `'use client'` for interactivity
- Layout and providers wrap client components
- tRPC queries/mutations require client components

## Design Philosophy

### Principles

1. **Type Safety First** - End-to-end TypeScript with tRPC eliminates runtime type errors between client and server.

2. **Single Source of Truth** - Database schema lives in `lib/db/schema.ts`. Validation schemas in `lib/validations/`. No duplication.

3. **Colocation** - Related code lives together. tRPC routers with their utilities, components with their hooks.

4. **Progressive Enhancement** - Server-render what's possible, hydrate for interactivity. Mobile-first responsive design.

5. **Minimal Dependencies** - Prefer platform APIs and well-maintained libraries. No unnecessary abstractions.

### Code Style

- Functional components with hooks
- Named exports for components, type exports for types
- Async/await over promises
- Early returns over nested conditionals
- Descriptive variable names over comments

## Design Guidelines

The site follows a **coastal luxury aesthetic** with light/dark mode support.

### Typography

- **Primary font:** Forum (serif) - headings and body via `font-sans`/`font-serif`
- **Script font:** Great Vibes - decorative accents (`.script-font`)
- **Utility classes:** `.elegant-serif`, `.letter-spacing-wide`

### Color Palette (HSL CSS variables)

| Token | Light Mode | Usage |
|-------|------------|-------|
| `--primary` | `205 20% 65%` (Dusty Blue) | Buttons, links, accents |
| `--background` | `40 25% 98%` (Warm Cream) | Page background |
| `--foreground` | `210 20% 20%` (Deep Navy) | Primary text |
| `--card` | `40 30% 96%` | Card backgrounds |
| `--muted` | `40 20% 92%` | Subtle backgrounds |

### Custom Utilities

- `.coastal-shadow` - Soft shadow: `box-shadow: 0 4px 20px rgba(168, 188, 201, 0.15)`
- `.fade-in-up` - Entrance animation (0.6s ease-out)
- `.hover-elevate` - Interactive brightness adjustment

### Layout Patterns

- `container mx-auto max-w-4xl px-6 py-20` - Standard page container
- Cards: `.coastal-shadow` + `border-0` for floating appearance
- Mobile: Hamburger menu with slide-out drawer (Sheet component)

## Environment Variables

```bash
DATABASE_URL=             # Neon PostgreSQL connection string
SITE_PASSWORD=            # Password for site access
UPSTASH_REDIS_REST_URL=   # Upstash Redis URL (rate limiting)
UPSTASH_REDIS_REST_TOKEN= # Upstash Redis token
RESEND_API_KEY=           # Resend API key (RSVP confirmations)
```

## TODO

### Content (Placeholder)

- [ ] **Our Story page** - Replace placeholder content with real story, timeline, and photos
- [ ] **Registry page** - Add actual registry links (Zola, Amazon, etc.)
- [ ] **FAQ page** - Replace placeholder FAQs with real questions
- [ ] **Photo gallery** - Add real engagement/couple photos

### Database Setup

- [ ] **Seed events** - Create the 3 events in database (tea ceremony, welcome party, wedding)
- [ ] **Import guest list** - Add parties and guests from invitation list
- [ ] **Create invitations** - Link parties to the events they're invited to

### Features (Unimplemented)

- [ ] **RSVP confirmation emails** - Send email via Resend after RSVP submission
  - Add `RESEND_API_KEY` to environment
  - Create email template in `lib/email/`
  - Call from `rsvp.submit` procedure
- [ ] **Redis rate limiting** - Currently optional, make production-ready
  - Ensure `UPSTASH_REDIS_*` env vars are set
  - Add rate limiting to all public procedures
- [ ] **Admin dashboard** - View RSVPs, manage guests, export data
- [ ] **Meal selection** - Add meal choice options to RSVP form

### Performance

- [ ] **Image optimization** - Use Next.js `<Image>` component for all photos
  - Convert to WebP/AVIF formats
  - Add proper width/height for CLS
  - Implement blur placeholders
- [ ] **Bundle optimization** - Analyze and reduce First Load JS (~150kB)

### Testing

- [ ] **E2E tests** - Update Playwright tests for new party-based RSVP flow
- [ ] **Add integration tests** - Test full RSVP flow with database
