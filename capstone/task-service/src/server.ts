import Fastify from "fastify";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { tasks } from "./schema";

// 1. Initialize our Fastify web framework with structured logging,  enables Pino structured logging.
const server = Fastify({ logger: true });

const AUDIT_URL = process.env.AUDIT_SERVICE_URL || "http://localhost:3002";

// CAPSTONE REQUIREMENT 2: Webhook / Audit Log Emitter
async function emitAuditEvent(action: string, taskData: any) {
  try {
    await fetch(`${AUDIT_URL}/events`,  {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,       
        task: taskData, 
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.log(`[Audit Warning] Could not reach Hono audit service: ${err}`);
  }
}

// CRUD

// POST
server.post("/tasks", async (request, reply) => {
  const body = request.body as { title: string };
  
  // Validation: make sure title is provided
  if (!body?.title) {
    return reply.code(400).send({ error: "Title is required" });
  }

  // TYPED QUERY: Drizzle safely inserts into PostgreSQL
  const [newTask] = await db.insert(tasks).values({  //INSERT INTO tasks (title) VALUES ($1)
    title: body.title,
  }).returning();

  // Fire webhook to Service 2 (Hono)
  await emitAuditEvent("TASK_CREATED", newTask);

  return reply.code(201).send(newTask);
});

//GET All
server.get("/tasks", async (request, reply) => {
  // TYPED QUERY: SELECT * FROM tasks
  const allTasks = await db.select().from(tasks);
  return reply.send(allTasks);
});


// GET by id
server.get("/tasks/:id", async (request, reply) => {
  const { id } = request.params as { id: string };

  // TYPED QUERY: SELECT * FROM tasks WHERE id = :id
  const [task] = await db.select().from(tasks).where(eq(tasks.id, Number(id))); //eq(tasks.id, Number(id)): Type-safe SQL WHERE tasks.id = $1.

  if (!task) {
    return reply.code(404).send({ error: "Task not found" });
  }

  return reply.send(task);
});

//UPDATE 
server.put("/tasks/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const body = request.body as { title?: string; status?: string };

  // TYPED QUERY: UPDATE tasks SET ... WHERE id = :id  //UPDATE tasks SET title = $1, status = $2 WHERE id = $3 RETURNING *;
  const [updatedTask] = await db   
    .update(tasks)
    .set(body)
    .where(eq(tasks.id, Number(id)))
    .returning();

  if (!updatedTask) {
    return reply.code(404).send({ error: "Task not found" });
  }

  // Fire webhook to Service 2 (Hono)
  await emitAuditEvent("TASK_UPDATED", updatedTask);

  return reply.send(updatedTask);
});


// DELETE 
server.delete("/tasks/:id", async (request, reply) => {
  const { id } = request.params as { id: string };

  // TYPED QUERY: DELETE FROM tasks WHERE id = :id
  const [deletedTask] = await db
    .delete(tasks)
    .where(eq(tasks.id, Number(id)))
    .returning();

  if (!deletedTask) {
    return reply.code(404).send({ error: "Task not found" });
  }

  // Fire webhook to Service 2 (Hono)
  await emitAuditEvent("TASK_DELETED", deletedTask);

  return reply.send({ message: "Task deleted successfully", deletedTask });
});


// sever Start
server.listen({ port: 3001, host: "0.0.0.0" }, (err) => {  //Setting 0.0.0.0 instructs Fastify to accept traffic coming from Docker port forwarding and other containers.
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log("Fastify Task Service running on port 3001");
});