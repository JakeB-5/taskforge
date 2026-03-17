# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TaskForge** is a full-stack project management platform (Jira/Linear-style) built as a TypeScript monorepo. It features kanban boards with drag-and-drop, multiple task views (board, list, calendar, timeline), team collaboration, and real-time dashboard analytics.

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Next.js 14 (App Router), React 18, TailwindCSS, Zustand, @dnd-kit, Recharts
- **Backend**: Hono (Node.js), JWT auth, bcryptjs
- **Database**: SQLite via @libsql/client + Drizzle ORM
- **UI Library**: Custom shadcn/ui-style components with Radix UI primitives
- **Validation**: Zod schemas shared between frontend and backend
- **Testing**: Vitest, @testing-library/react

## Common Commands

```bash
# Install dependencies
pnpm install

# Development (starts both API on :3001 and Web on :3000)
pnpm dev

# Build everything
pnpm build

# Run all tests
pnpm test

# Run tests for a specific package
pnpm test --filter=@taskforge/shared
pnpm test --filter=@taskforge/api
pnpm test --filter=@taskforge/web

# Database operations
pnpm db:generate    # Generate migrations from schema
pnpm db:migrate     # Run migrations
pnpm db:seed        # Seed demo data (requires: cd packages/database && pnpm db:seed)

# Format code
pnpm format
```

## Architecture

### Monorepo Package Structure

```
packages/shared    (@taskforge/shared)    - Types, Zod schemas, constants, utilities
packages/database  (@taskforge/database)  - Drizzle ORM schema, client, seed
packages/ui        (@taskforge/ui)        - 28 Radix-based UI components (shadcn pattern)
apps/api           (@taskforge/api)       - Hono REST API server
apps/web           (@taskforge/web)       - Next.js 14 frontend
```

### Dependency Graph

```
@taskforge/shared ← @taskforge/database ← @taskforge/api
@taskforge/shared ← @taskforge/ui       ← @taskforge/web
```

All packages use TypeScript source imports (no build step required for development). Turborepo handles build ordering via `dependsOn: ["^build"]`.

### Backend Architecture (apps/api)

The API follows a **routes → services → database** layered pattern:

- `routes/` - Hono route handlers, input validation with Zod, response formatting
- `services/` - Business logic, database queries via Drizzle ORM
- `middleware/` - JWT auth (`authRequired`), validation (`validate`), rate limiting, error handling
- `utils/config.ts` - Environment config with singleton pattern

Key routes: `/api/auth`, `/api/workspaces`, `/api/projects`, `/api/tasks`, `/api/comments`, `/api/labels`, `/api/activities`, `/api/notifications`, `/api/search`, `/api/dashboard`

Auth flow: Register/Login returns JWT → client stores in localStorage → `Authorization: Bearer <token>` header → `authRequired` middleware decodes and attaches user to Hono context.

### Frontend Architecture (apps/web)

Next.js App Router with route groups:

- `(auth)/` - Login, Register, Forgot Password (centered layout)
- `(dashboard)/` - All authenticated pages (sidebar layout)
  - `dashboard/` - Stats cards, charts, activity feed
  - `projects/` - Project list and detail with sub-views
  - `projects/[projectId]/board/` - Kanban board with @dnd-kit drag-and-drop
  - `projects/[projectId]/list/` - Sortable table view
  - `projects/[projectId]/calendar/` - Monthly calendar grid
  - `projects/[projectId]/timeline/` - Gantt-style timeline

State management: Zustand stores in `stores/` (auth, workspace, project, task, notification). API calls via typed fetch client in `lib/api-client.ts` with per-entity modules in `lib/api/`.

### UI Component Library (packages/ui)

All components follow shadcn/ui conventions:
- `React.forwardRef` with proper ref forwarding
- `className` merging via `cn()` (clsx + tailwind-merge)
- Variants via `class-variance-authority` (cva)
- Radix UI primitives for accessibility
- `"use client"` directive on interactive components

Import all components from `@taskforge/ui` (barrel export).

### Database Schema (packages/database)

10 tables defined with Drizzle ORM: `users`, `workspaces`, `workspaceMembership`, `projects`, `projectMembers`, `tasks`, `comments`, `labels`, `taskLabels`, `attachments`, `activities`, `notifications`.

Relations defined in `schema/relations.ts`. TEXT type for all IDs (nanoid format). Client creation in `client.ts` using `@libsql/client`.

### Shared Package (packages/shared)

- `types/` - TypeScript interfaces for all entities (User, Task, Project, etc.)
- `schemas/` - Zod schemas for API input validation (CreateTask, UpdateProject, etc.)
- `constants/` - Status enums, priority mappings, color palettes, limits
- `utils/` - ID generation (nanoid), date formatting, string helpers (slugify, truncate)

## Environment Variables

Copy `.env.example` to `.env`. Required: `JWT_SECRET`. All others have defaults.

## Key Patterns

- **API responses**: Consistent `{ success: boolean, data?: T, error?: string }` format via `utils/response.ts`
- **Validation**: Zod schemas from `@taskforge/shared` used in both API middleware and React Hook Form resolvers
- **IDs**: All entity IDs are nanoid strings with entity prefixes (e.g., `usr_`, `prj_`, `tsk_`) generated via `@taskforge/shared/utils`
- **Imports**: Use `@taskforge/ui` barrel import (not deep `@taskforge/ui/components/x` paths). Use `@/*` path alias within the web app.
- **Relative imports**: Do NOT use `.js` extensions on TypeScript relative imports (webpack/Next.js resolution incompatibility)
