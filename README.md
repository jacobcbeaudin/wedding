# Wedding Website

A modern, full-stack wedding website with RSVP management, guest tracking, and an admin dashboard.

## Features

- **RSVP System** - Guest lookup by name, party-based RSVP flow, multi-event support
- **Meal Selection** - Per-guest meal choices with dietary restriction tracking
- **Song Requests** - Guests can request songs for the reception
- **Confirmation Emails** - Automated emails via Resend after RSVP submission
- **Admin Dashboard** - Manage parties, guests, events, invitations, and view RSVPs
- **Password Protection** - Site-wide and admin authentication with rate limiting

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (end-to-end type safety)
- **API:** tRPC v11
- **Database:** Neon PostgreSQL with Drizzle ORM
- **Styling:** Tailwind CSS + shadcn/ui
- **Hosting:** Vercel
- **Email:** Resend
- **Rate Limiting:** Upstash Redis

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Upstash Redis account (for rate limiting)

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repo-url>
   cd wedding
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

   Required variables:

   ```bash
   DATABASE_URL=           # Neon PostgreSQL connection string
   SITE_PASSWORD=          # Password for site access
   ADMIN_PASSWORD=         # Admin dashboard login
   UPSTASH_REDIS_REST_URL= # Upstash Redis URL
   UPSTASH_REDIS_REST_TOKEN= # Upstash Redis token
   RESEND_API_KEY=         # Resend API key (for emails)
   ```

3. **Initialize the database:**
   ```bash
   npm run db:push    # Push schema to database
   npm run db:seed    # Seed events
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Import guests (optional):**
   ```bash
   # See scripts/guests.example.csv for format
   npm run db:seed:csv
   ```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run check` | TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Drizzle schema to database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed events |
| `npm run db:seed:csv` | Import guests from CSV |
| `npm test` | Run unit tests (watch mode) |
| `npm run test:run` | Run unit tests (single run) |
| `npm run test:e2e` | Run Playwright e2e tests |

## Project Structure

```text
wedding/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   └── providers/          # Context providers
├── lib/
│   ├── db/                 # Database schema and connection
│   ├── trpc/               # tRPC routers and configuration
│   ├── validations/        # Zod schemas
│   └── config/             # App configuration
├── hooks/                  # Custom React hooks
├── public/                 # Static assets
└── tests/                  # Unit and e2e tests
```

## Architecture

For detailed architecture documentation, design guidelines, and development patterns, see [CLAUDE.md](./CLAUDE.md).

## License

Private - All rights reserved.
