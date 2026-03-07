import { router, publicProcedure } from "../trpc.js";
import { testSchema } from "../schemas/test.js";
import { desksTable, drizzleOrm } from "@hot-desking/drizzle";
import { db } from "../context.js";
export const deskRouter = router({
  test: publicProcedure.input(testSchema).query(async ({ input }) => {
    const desks = await db.select().from(desksTable);
    console.log("Input:", input);
    return { message: desks };
  }),
});
