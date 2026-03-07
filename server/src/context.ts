import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { schema } from "@hot-desking/drizzle";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const databaseURL = process.env.DATABASE_URL!;
export const db = drizzle(databaseURL, { schema });
if (!databaseURL) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

export function createContext({ req, res }: CreateFastifyContextOptions) {
  return { req, res, db };
}

export type Context = inferAsyncReturnType<typeof createContext>;
