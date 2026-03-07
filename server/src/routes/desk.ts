import { router, publicProcedure } from "../trpc.js";
import { testSchema } from "../schemas/test.js";

export const deskRouter = router({
  test: publicProcedure.input(testSchema).query(({ input }) => {
    console.log("Input:", input);
    return { message: "Hello world" };
  }),
});
