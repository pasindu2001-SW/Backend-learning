# Capstone Services

The capstone is a small task-management system composed of two HTTP services and PostgreSQL:

- `task-service` - Fastify API for task CRUD operations.
- `audit-service` - Hono service that records task events in memory.
- `database` - PostgreSQL 15 database managed by Docker Compose.

## Run the full stack

From this directory:

```bash
docker compose up --build
```

The services are available at:

- Task API: `http://localhost:3001`
- Audit API: `http://localhost:3002`
- PostgreSQL: `localhost:5433`

Stop the stack with:

```bash
docker compose down
```

PostgreSQL data is stored in the Docker volume `pgdata`. Remove it when a clean database is needed:

```bash
docker compose down -v
```

## Task API

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/tasks` | Create a task with `{ "title": "..." }` |
| `GET` | `/tasks` | List all tasks |
| `GET` | `/tasks/:id` | Get one task |
| `PUT` | `/tasks/:id` | Update `title` and/or `status` |
| `DELETE` | `/tasks/:id` | Delete a task |

Task creation, updates, and deletes emit events to the audit service.

## Audit API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Health check |
| `POST` | `/events` | Record an audit event |
| `GET` | `/events` | List in-memory audit events |

Audit events are held in memory and are lost when the audit service restarts.

## Local task-service development

Start PostgreSQL and the audit service first, then run the task service from its directory:

```bash
pnpm install
pnpm exec drizzle-kit migrate
pnpm exec tsx src/server.ts
```

The default local database URL is `postgresql://admin:password123@127.0.0.1:5433/capstonedb`. Set `DATABASE_URL` and `AUDIT_SERVICE_URL` to override it.