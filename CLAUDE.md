# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (Vite + Express)
npm run build        # Build for production (Vite frontend + esbuild server)
npm run start        # Run production build
npm run check        # TypeScript type checking
npm run db:push      # Push Drizzle schema to database
```

## Architecture

This is a wedding website using a monorepo structure with React frontend and Express backend.

### Directory Structure
- `client/` - React frontend (Vite)
- `server/` - Express backend
- `shared/` - Shared types and database schema (Drizzle)
- `attached_assets/` - Static assets

### Path Aliases
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

### Frontend Stack
- React 18 with wouter for routing
- TanStack Query for data fetching
- Tailwind CSS with shadcn/ui components
- Framer Motion for animations

### Backend Stack
- Express with TypeScript
- Drizzle ORM with PostgreSQL (Neon serverless)
- In-memory storage available for development (`MemStorage` in `server/storage.ts`)

### Key Patterns
- API routes should be prefixed with `/api`
- Database schema defined in `shared/schema.ts` using Drizzle
- Storage interface in `server/storage.ts` abstracts data access
- UI components in `client/src/components/ui/` are shadcn/ui primitives

## Design Guidelines

The site follows a **coastal luxury aesthetic** - see `design_guidelines.md` for details:
- Typography: Cormorant Garamond (serif headings) + Montserrat (sans-serif body)
- Colors: Dusty Blue (#A8BCC9), Cream (#F5F1EA), Deep Navy (#2C3E50)
- Generous whitespace, subtle animations, photography-first design
