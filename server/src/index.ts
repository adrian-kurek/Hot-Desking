import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { createContext } from "./context.js";
import { appRouter } from "./routes/app.js";
import { Logger } from "./utils/logger.js";
const server = fastify({});

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
});

const port = process.env.PORT || "3000";

const logger = new Logger();

async function startServer(port: string) {
  try {
    logger.info(`server started at port ${port}`);
    await server.listen({ port: +port });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

startServer(port);
