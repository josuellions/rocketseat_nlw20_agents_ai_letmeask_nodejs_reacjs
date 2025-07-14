import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = path.resolve(__dirname, "..", "..", ".env");
const loaded = dotenv.config({ path: envFile });
dotenvExpand.expand(loaded);

if (!fs.existsSync(envFile)) {
  throw new Error(`Arquivo .env.development não encontrado em: ${envFile}`);
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string().url().startsWith("postgres://"),
  GOOGLE_GEMINI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
