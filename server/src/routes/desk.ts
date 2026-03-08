import { router, publicProcedure } from "../trpc.js";
import { desksTable } from "@hot-desking/drizzle";
import { db } from "../context.js";
export const deskRouter = router({
  test: publicProcedure.query(async ({ input }) => {
    const desks = await db.select().from(desksTable);
    console.log("Input:", input);
    return { message: desks };
  }),
});
