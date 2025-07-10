import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  casing: "snake_case",
  schema: "./infra/database/schema/**.ts",
  out: "./infra/database/migrations",
  dbCredentials: {
    url: String(process.env.DATABASE_URL),
  },
});

// import { env } from "@src/types/env.ts";
// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   dialect: "postgresql",
//   casing: "snake_case",
//   schema: "./src/db/schema/**.ts",
//   out: "./src/db/migrations",
//   dbCredentials: {
//     url: env.DATABASE_URL,
//   },
// });
