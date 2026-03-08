import { router } from "../trpc.js";
import { deskRouter } from "./desk.js";

export const appRouter = router({
  desks: deskRouter,
});

export type AppRouter = typeof appRouter;
