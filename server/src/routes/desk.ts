import { router, publicProcedure } from "../trpc.js";
import { desksTable } from "@hot-desking/drizzle";
import { db } from "../context.js";
import { TRPCError } from "@trpc/server";
import { logger } from "../index.js";
import { updateSchema, withOnlyIDSchema } from "../schemas/desk.js";
import { eq } from "drizzle-orm";
export const deskRouter = router({
  getDesks: publicProcedure.query(async () => {
    try {
      logger.info("started fetching data about desks");
      const desks = await db.select().from(desksTable);
      return { message: desks };
    } catch (error) {
      logger.error("failed to get data about desks", { error });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "failed to fetch desks",
        cause: error,
      });
    }
  }),
  delete: publicProcedure
    .input(withOnlyIDSchema)
    .mutation(async ({ input }) => {
      try {
        logger.info("started reservating a desk");
        const desk = await db
          .select({
            isAvailable: desksTable.isAvailable,
          })
          .from(desksTable)
          .where(eq(desksTable.id, input.id));
        if (desk.length == 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "failed to find desk with provided id",
          });
        }
        if (!desk[0].isAvailable) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "cannot edit reservated desk",
          });
        }
        await db.delete(desksTable).where(eq(desksTable.id, input.id));
      } catch (error) {
        logger.error("failed to get data about desks", { error });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "failed to fetch desks",
          cause: error,
        });
      }
    }),
  reservate: publicProcedure
    .input(withOnlyIDSchema)
    .mutation(async ({ input }) => {
      try {
        logger.info("started reservating a desk");
        const desk = await db
          .select({
            isAvailable: desksTable.isAvailable,
          })
          .from(desksTable)
          .where(eq(desksTable.id, input.id));
        if (desk.length == 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "failed to find desk with provided id",
          });
        }
        if (!desk[0].isAvailable) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "cannot edit reservated desk",
          });
        }
        await db
          .update(desksTable)
          .set({
            isAvailable: false,
          })
          .where(eq(desksTable.id, input.id));
      } catch (error) {
        logger.error("failed to get data about desks", { error });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "failed to fetch desks",
          cause: error,
        });
      }
    }),
  updateDesk: publicProcedure
    .input(updateSchema)
    .mutation(async ({ input }) => {
      try {
        logger.info("started updating data about desks");
        const desk = await db
          .select({
            isAvailable: desksTable.isAvailable,
            name: desksTable.name,
          })
          .from(desksTable)
          .where(eq(desksTable.id, input.id));
        if (desk.length == 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "failed to find desk with provided id",
          });
        }
        if (!desk[0].isAvailable) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "cannot edit reservated desk",
          });
        }

        await db
          .update(desksTable)
          .set({
            name: input.name,
          })
          .where(eq(desksTable.id, input.id));
      } catch (error) {
        logger.error("failed to get data about desks", { error });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "failed to fetch desks",
          cause: error,
        });
      }
    }),
});
