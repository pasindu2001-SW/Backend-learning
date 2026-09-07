import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

//Drizzle what is should be
export const tasks = pgTable("tasks", {  // Defines the table named "tasks" in PostgreSQL.
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    status: text("status").notNull().default("TODO"), 
    createdAt: timestamp("created_at").defaultNow(),
});