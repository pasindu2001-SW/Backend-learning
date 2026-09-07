import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";  //Imports all tables

//connection pooling
// Uses DATABASE_URL from Docker if present, otherwise defaults to local 5433
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://admin:password123@127.0.0.1:5433/capstonedb";

//Max connection pooling's 10
const queryClinet = postgres(connectionString, { max: 10});

//Access of pool to Drizzle so it talk to PostgreSQL
export const db = drizzle(queryClinet, { schema });