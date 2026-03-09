import * as z from "zod";

export const updateSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const withOnlyIDSchema = z.object({
  id: z.string(),
});

export const withOnlyNameSchema = z.object({
  // można zrobić addSchema też ,ale ta nazwa jest bardziej flexible
  name: z.string(),
});
