# Audit Service

This service uses Hono and Bun to receive and display task audit events. Events are stored in an in-memory array for learning purposes.

## Run locally

```bash
bun install
bun run src/index.ts
```

The service listens on `http://localhost:3002`.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Health check |
| `POST` | `/events` | Store an event containing `action` and `task` |
| `GET` | `/events` | Return all stored events |

Run it with Docker from the `capstone` directory:

```bash
docker compose up --build audit-service
```