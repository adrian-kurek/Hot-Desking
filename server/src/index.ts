import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { createContext, db } from "./context.js";
import { appRouter } from "./routes/app.js";
import { Logger } from "./utils/logger.js";
import cors from "@fastify/cors";
import { sql } from "drizzle-orm";
const server = fastify({});

await server.register(cors, {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
});
server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
});

const port = process.env.PORT || "3000";

export const logger = new Logger();

async function startServer(port: string) {
  try {
    await db.execute(sql`SELECT 1`);
    logger.info("database connected successfully");
  } catch (err) {
    logger.error("failed to connect to database", { err });
    process.exit(1);
  }

  try {
    await server.listen({ port: +port });
    logger.info(`server started at port ${port}`);
  } catch (err) {
    logger.error("failed to start server", { err });
    process.exit(1);
  }
}

startServer(port);
