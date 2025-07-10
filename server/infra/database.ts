import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../src/types/env.ts";
import { schema } from "./database/schema/index.ts";

export const sql = postgres(env.DATABASE_URL);
// export const sql = postgres(
//   "postgres://postgres:docker@localhost:5432/postgres-dev-letmeask-agents"
// );

export const database = drizzle(sql, {
  schema,
  casing: "snake_case",
});
