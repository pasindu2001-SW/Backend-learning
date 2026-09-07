# Node and Bun Examples

This folder contains TypeScript backend learning examples:

- `index.ts` fetches a JSONPlaceholder user and validates the response with Zod.
- `server.ts` runs a Fastify restaurant-order API with TypeBox validation and Swagger UI.
- `hono.ts` contains a Hono example with Zod request validation and middleware.

## Install dependencies

```bash
pnpm install
```

## Run the examples

Run the Zod fetch example:

```bash
pnpm exec tsx index.ts
```

Run the Fastify API:

```bash
pnpm exec tsx server.ts
```

The Fastify API listens on `http://localhost:3000`. Swagger UI is available at `http://localhost:3000/docs`.

The Fastify routes are:

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/orders` | Create an order |
| `GET` | `/orders` | List orders |
| `PUT` | `/orders/:id` | Update an order |
| `DELETE` | `/orders/:id` | Delete an order |

Run the Hono example with Bun:

```bash
bun install
bun run hono.ts
```

The Hono example also uses port `3000`, so stop the Fastify example before starting it.