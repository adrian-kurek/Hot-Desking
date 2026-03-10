import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { schema } from "@hot-desking/drizzle";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres"; // ← change to node-postgres
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const databaseURL = process.env.DATABASE_URL;

if (!databaseURL) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

const client = new pg.Pool({
  connectionString: databaseURL,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
  max: 10,
});
export const db = drizzle(client, { schema });

export function createContext({ req, res }: CreateFastifyContextOptions) {
  return { req, res, db };
}
