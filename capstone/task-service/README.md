# Task Service

This service provides a Fastify CRUD API backed by PostgreSQL through Drizzle ORM. Changes are sent to the audit service at `AUDIT_SERVICE_URL`.

## Run locally

Ensure PostgreSQL is available, then run from this directory:

```bash
pnpm install
pnpm exec drizzle-kit migrate
pnpm exec tsx src/server.ts
```

The API listens on `http://localhost:3001`.

Default local connection settings:

```text
DATABASE_URL=postgresql://admin:password123@127.0.0.1:5433/capstonedb
AUDIT_SERVICE_URL=http://localhost:3002
```

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/tasks` | Create a task with `{ "title": "..." }` |
| `GET` | `/tasks` | List all tasks |
| `GET` | `/tasks/:id` | Get a task by numeric ID |
| `PUT` | `/tasks/:id` | Update the task title or status |
| `DELETE` | `/tasks/:id` | Delete a task |

## Database

The Drizzle schema is in `src/schema.ts`, and generated migrations are stored in `drizzle/`. To generate a migration after changing the schema:

```bash
pnpm exec drizzle-kit generate
```