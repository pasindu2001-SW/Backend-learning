import { defineConfig } from "drizzle-kit";

//Schema Migration/ so Drizzle know where is the docker database
export default defineConfig({
  schema: "./src/schema.ts",  //where Drizzle looks to find TypeScript schema definitions
  out: "./drizzle", 
  dialect: "postgresql", 
  dbCredentials: {
    url: "postgresql://admin:password123@127.0.0.1:5433/capstonedb",
  },
  verbose: true, //Prints executed SQL statements
  strict: true,  //Prompts for confirmation before applying potentially destructive schema operations
});