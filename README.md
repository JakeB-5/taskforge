# TaskForge

A full-stack project management platform built with modern web technologies. TaskForge brings the power of tools like Jira and Linear with a clean, intuitive interface for managing tasks, projects, and teams.

> **🤖 Built by AI**: This project was built entirely by an autonomous AI agent team using Claude Code's multi-agent orchestration system. It demonstrates what's possible when multiple specialized AI agents collaborate to deliver a complete, production-ready application.

## Features

### Task Management
- **Kanban Board** - Drag-and-drop task management with visual workflow states
- **List View** - Sortable task lists with bulk action support
- **Calendar View** - Monthly grid layout with task indicators
- **Timeline/Gantt View** - Visual project scheduling and dependency management

### Project & Team
- **Workspace Management** - Organize multiple projects and teams
- **Project Management** - Create, configure, and manage projects with custom settings
- **Team Member Management** - Assign roles and permissions to team members
- **Task Assignment** - Assign tasks to team members with role-based access control

### Task Details
- **Labels & Tags** - Organize tasks with customizable labels
- **Subtasks** - Break down complex tasks into smaller work items
- **Comments** - Real-time collaboration with threaded comments
- **Attachments** - Upload and manage task-related files

### Additional Features
- **Dashboard** - Overview with stats, activity feed, and charts
- **Notifications** - Real-time notifications for task updates and mentions
- **Global Search** - Fast full-text search across tasks, projects, and comments (Cmd+K)
- **REST API** - Comprehensive ~40 endpoint API for integrations

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: TailwindCSS with shadcn-style components
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Drag & Drop**: @dnd-kit
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Server**: Hono REST API
- **Authentication**: JWT-based auth with bcryptjs
- **Database**: SQLite via @libsql/client
- **ORM**: Drizzle ORM
- **Validation**: Zod schemas

### Monorepo & Build
- **Monorepo**: Turborepo + pnpm workspaces
- **Language**: TypeScript (311 files, ~20K LOC)
- **Testing**: Vitest (160+ tests)
- **Linting**: Built-in TypeScript + ESLint support

## Project Structure

```
taskforge/
├── apps/
│   ├── api/                 # Hono REST API server
│   │   ├── src/
│   │   │   ├── routes/     # API route handlers
│   │   │   ├── services/   # Business logic
│   │   │   ├── middleware/ # Auth, validation, error handling
│   │   │   └── types.ts    # TypeScript definitions
│   │   └── package.json
│   │
│   └── web/                # Next.js frontend
│       ├── app/            # App Router pages
│       ├── components/     # React components
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Utilities and helpers
│       └── package.json
│
├── packages/
│   ├── shared/             # Shared types, schemas, constants
│   │   ├── src/
│   │   │   ├── schemas/   # Zod validation schemas
│   │   │   ├── types/     # TypeScript types
│   │   │   └── constants/ # Shared constants
│   │   └── package.json
│   │
│   ├── database/          # Drizzle ORM & database
│   │   ├── src/
│   │   │   ├── schema/    # Drizzle table definitions
│   │   │   └── migrations/ # Database migrations
│   │   └── package.json
│   │
│   └── ui/                # 28 Radix-based UI components
│       ├── src/
│       │   └── components/
│       └── package.json
│
├── package.json           # Root workspace config
├── pnpm-workspace.yaml    # pnpm workspace definition
├── turbo.json            # Turbo build config
└── tsconfig.base.json    # Base TypeScript config
```

## Getting Started

### Prerequisites
- Node.js >= 20
- pnpm >= 10.32.1

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskforge
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL=file:./data/taskforge.db

   # Auth (generate a random secret for production)
   JWT_SECRET=change-this-to-a-random-secret
   JWT_EXPIRES_IN=7d

   # API
   API_PORT=3001
   API_HOST=localhost

   # Frontend
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Initialize the database**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Start development servers**
   ```bash
   pnpm dev
   ```

   The application will be available at:
   - **Frontend**: http://localhost:3000
   - **API**: http://localhost:3001

## Available Scripts

### Development & Building
| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all development servers (API + Web) |
| `pnpm build` | Build all packages and apps for production |
| `pnpm lint` | Run linting across all packages |
| `pnpm clean` | Clean build artifacts and node_modules |

### Database
| Command | Description |
|---------|-------------|
| `pnpm db:generate` | Generate Drizzle ORM types from schema |
| `pnpm db:migrate` | Run pending database migrations |
| `pnpm db:seed` | Seed database with sample data |

### Testing
| Command | Description |
|---------|-------------|
| `pnpm test` | Run all tests (unit + integration) |
| `pnpm test:unit` | Run unit tests only |
| `pnpm test:integration` | Run integration tests only |

### Code Quality
| Command | Description |
|---------|-------------|
| `pnpm format` | Format all code with Prettier |

## Testing

The project includes comprehensive test coverage with **160+ tests** across unit and integration tests.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run with coverage
pnpm test --coverage

# Run specific package tests
pnpm test --filter=@taskforge/api
```

### Test Structure
- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API endpoint and cross-package integration tests
- **Framework**: Vitest with @vitest/coverage-v8

## API Endpoints

The REST API provides ~40 endpoints organized by resource:

- **Auth**: Registration, login, token refresh
- **Workspaces**: Create, read, update, delete workspaces
- **Projects**: Manage projects within workspaces
- **Tasks**: Full CRUD operations for tasks
- **Labels**: Create and manage task labels
- **Comments**: Add and manage task comments
- **Attachments**: Upload and manage file attachments
- **Users**: Manage team members and roles
- **Notifications**: Fetch and manage notifications
- **Search**: Global full-text search
- **Dashboard**: Fetch dashboard stats and charts
- **Activities**: View audit log and activity history

### API Documentation

For detailed API documentation, refer to the route handlers in `apps/api/src/routes/`.

Example request:
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task", "description": "Task description"}'
```

## Development Workflow

### Adding a New Feature

1. **Create a feature branch** (branching from `dev`)
   ```bash
   git checkout -b feature/your-feature-name dev
   ```

2. **Run tests locally**
   ```bash
   pnpm test
   ```

3. **Format code**
   ```bash
   pnpm format
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: description of your feature"
   git push -u origin feature/your-feature-name
   ```

5. **Open a pull request** targeting `dev` branch

### Database Schema Changes

1. **Update the Drizzle schema** in `packages/database/src/schema/`
2. **Generate types**
   ```bash
   pnpm db:generate
   ```
3. **Create migration** (Drizzle will detect changes)
4. **Run migrations locally**
   ```bash
   pnpm db:migrate
   ```

## Deployment

### Production Build

```bash
pnpm build
```

This creates optimized builds for both the frontend and API:
- **Frontend**: `.next/` directory (ready for deployment to Vercel, etc.)
- **API**: `dist/` directory (ready for Node.js hosting)

### Environment Configuration

For production, ensure these environment variables are set:
- `JWT_SECRET` - Use a strong random secret
- `DATABASE_URL` - Production database URL
- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL` - Your production API URL

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -m 'feat: description'`
4. Push to branch: `git push origin feature/name`
5. Open a pull request to `dev` branch

## License

MIT License - see LICENSE file for details

## About

TaskForge demonstrates the capabilities of AI-driven full-stack development. Built by an autonomous team of specialized AI agents, it showcases:

- **Multi-agent Collaboration**: Different AI agents specialized in frontend, backend, database, testing, and integration
- **Production Quality**: Comprehensive test coverage, type safety, and error handling
- **Modern Stack**: Latest frameworks and best practices in web development
- **Zero Manual Configuration**: Database, migrations, and seeding all automated

For more information about how this was built, see the project documentation and commit history.
