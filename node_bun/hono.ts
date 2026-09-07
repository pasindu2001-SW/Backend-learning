//phase 3

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

//"c"(Context) memory
type Variables = {
    userRole: string;  // middleware will attach this to every request
};

const app = new Hono<{ Variables: Variables }>(); //link the context memory schema to the app

//compaire request context ( Fastify vs Hono)

// Fastify (Phase 2): 
// server.get('/fastify', (request, reponse) => { reponse.send("Hello") })
// 
// Hono (Phase 3): 
// We only use ONE box called "c". It handles both reading and replying!
// app.get("/orders", (c) => {
//     return c.json(ordersDatabase);
// });

//................
//Add Authentication Middleware
app.use("*", async (c, next) => {
    //Fake security token
    const isAuthenticated = true;

    if (! isAuthenticated) {
        return c.json({ error: "Unauthorized"}, 401);
    }

    //appending typed user context
    c.set("userRole", "Admin");

    await next(); //Middleware chaining
});

//................
//Re-implement endpoints to  @hono/zod-validator
const OrderSchema = z.object({
  id: z.string(),
  item: z.string(),
  price: z.number(),
  secretRecipe: z.string().optional(),
});

const ParamsSchema = z.object({
    id: z.string(),
});

//fake database
const ordersDatabase: any[] = [];

//Post with ZValidator
app.post("/orders", zValidator("json", OrderSchema), (c) => {
  const newOrder = c.req.valid("json"); // 100% Type-Safe Data!
  
  ordersDatabase.push(newOrder);
  // Response Serialization: Manually removing the secret recipe
  const { secretRecipe, ...safeOrder } = newOrder;
  return c.json(safeOrder, 201);
});

//Get
app.get("/orders", (c) => {
    return c.json(ordersDatabase);
});


//delete + validating
app.delete("/orders/:id", zValidator("param", ParamsSchema), (c) => {
  const { id } = c.req.valid("param"); // 100% Type-Safe ID!
  const index = ordersDatabase.findIndex((order) => order.id === id);
  if (index !== -1) {
    ordersDatabase.splice(index, 1);
  }
  return c.json({ message: "Order deleted successfully!" });
});

export default {
    port: 3000,
    fetch: app.fetch,
};