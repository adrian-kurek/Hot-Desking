import * as z from "zod";

export const testSchema = z.object({
  username: z.string().optional(),
});
