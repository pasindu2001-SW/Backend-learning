import Fastify, { FastifyError } from "fastify"; //contains properties like statusCode, validation, and code
import cors from "@fastify/cors"; //Cross-Origin Resource Sharing 
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { Type } from "@sinclair/typebox";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

// Fastify Server
const server = Fastify({
  logger: true, //Fastify's built-in Pino structured logger
}).withTypeProvider<TypeBoxTypeProvider>(); //Attaches TypeBox as the primary schema type provider

//...............................................
// Schemas & CRUD Microservice
// TypeBox Schemas / rules
const OrderSchema = Type.Object({
  id: Type.String(),
  item: Type.String(),
  price: Type.Number(),
  secretRecipe: Type.Optional(Type.String()),
});

//Id provider
const ParamsSchema = Type.Object({
  id: Type.String(),
});

//responce schema
const OrderResponseSchema = Type.Object({
  id: Type.String(),
  item: Type.String(),
  price: Type.Number(),
  // not sending the recipe
});

//mock "database"
const ordersDatabase: any[] = [];

//...............................................
//Centralized Error Handling
server.setErrorHandler(function (error: FastifyError, request, reply) {
  const rfcError = {
    type: "https://my-restaurant.com/errors/bad-request",  //URI reference
    title: error.validation ? "Validation Error" : "Server Error",
    status: error.statusCode || 500,
    detail: error.message, //readable error message 
    instance: request.url, //URL path that was called
  };
  this.log.error(rfcError);
  reply.status(rfcError.status).send(rfcError);
});

//...............................................
// ***Register Plugins  and docmentation
//server start
const start = async () => {
  try {
    // AWAIT for the plugins so they wake up BEFORE the routes are created
    await server.register(cors);
    await server.register(swagger, {
      openapi: {
        info: { title: "Restaurant API", version: "1.0.0" }, //build the documentation 
        servers: [{ url: "http://localhost:3000" }]
      },
    });
    await server.register(swaggerUI, {
      routePrefix: "/docs",  //Swagger UI web page
    });

    // Post rout
    server.post(
      "/orders",
      {
        schema: {
          description: "Creates a new order",
          tags: ["Orders"],
          body: OrderSchema,
          response: { 201: OrderResponseSchema },
        },
      },
      async (request, reply) => {
        const newOrder = request.body;
        ordersDatabase.push(newOrder);
        reply.code(201).send(newOrder);
      }
    );

    //Get rout
    server.get(
      "/orders",
      {
        schema: {
          description: "View all orders",
          tags: ["Orders"],
          response: { 200: Type.Array(OrderResponseSchema) },
        },
      },
      async (request, reply) => {
        return ordersDatabase;
      }
    );

    //Put
    server.put(
      "/orders/:id",
      {
        schema: {
          description: "Update the order",
          tags: ["Orders"],
          params: ParamsSchema, // Validates the id in the URL.
          body:OrderSchema,
        },
      },
      async (request, reply) => {
        const { id } = request.params as any;
        const newOrderData = request.body;

        //Finds the order by id in the array 
        const index = ordersDatabase.findIndex((order) => order.id === id);
        if (index !== -1) {
          ordersDatabase[index] = newOrderData;
        }

        reply.send(newOrderData);
      }
    );

    //delete
    server.delete(
      "/orders/:id",
      {
        schema: {
          description: "Delete order",
          tags: ["Orders"],
          params: ParamsSchema,
        },
      },
      async (request, reply) => {
        const { id } = request.params as any;

        const index = ordersDatabase.findIndex((order) => order.id === id);
        if (index !== -1) {
          ordersDatabase.splice(index, 1);
        }

        reply.send({ message: "Order Successfully deleted!"});
      }
    );

    // Listen for users
    await server.listen({ port: 3000 });
    console.log("Server is Running check localhost:3000/docs");
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();