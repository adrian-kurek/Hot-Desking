import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { createContext } from "./context.js";
import { appRouter } from "./routes/app.js";
import { Logger } from "./utils/logger.js";
import cors from "@fastify/cors";
const server = fastify({});

await server.register(cors, {
  origin: ["http://localhost:5173"],
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
    await server.listen({ port: +port });
    logger.info(`server started at port ${port}`);
  } catch (err) {
    server.log.error(err);
    logger.error("failed to start a server", { err });
    process.exit(1);
  }
}

startServer(port);
