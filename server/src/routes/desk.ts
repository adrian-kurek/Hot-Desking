import { router, publicProcedure } from "../trpc.js";
import { desksTable } from "@hot-desking/drizzle";
import { db } from "../context.js";
import { TRPCError } from "@trpc/server";
import { logger } from "../index.js";
import {
  updateSchema,
  withOnlyIDSchema,
  withOnlyNameSchema,
} from "../schemas/desk.js";
import { eq } from "drizzle-orm";
export const deskRouter = router({
  getDesks: publicProcedure.query(async () => {
    try {
      logger.info("started fetching data about desks");
      const desks = await db.select().from(desksTable);
      return desks;
    } catch (error) {
      logger.error("failed to get data about desks", { error });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "failed to fetch desks",
        cause: error,
      });
    }
  }),
  add: publicProcedure.input(withOnlyNameSchema).mutation(async ({ input }) => {
    try {
      logger.info("started adding a new desk");
      await db.insert(desksTable).values({
        name: input.name,
        isAvailable: true,
      });
    } catch (error) {
      logger.error("failed to add a new desk", { error });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "failed to add desk",
        cause: error,
      });
    }
  }),
  delete: publicProcedure
    .input(withOnlyIDSchema)
    .mutation(async ({ input }) => {
      try {
        logger.info("started deleting a desk");
        const desk = await db
          .select({
            isAvailable: desksTable.isAvailable,
          })
          .from(desksTable)
          .where(eq(desksTable.id, input.id));
        if (desk.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "failed to find desk with provided id",
          });
        }
        if (!desk[0].isAvailable) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "cannot edit reserved desk",
          });
        }
        await db.delete(desksTable).where(eq(desksTable.id, input.id));
      } catch (error) {
        logger.error("failed to delete a desk", { error });
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "failed to delete desk",
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
        if (desk.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "failed to find desk with provided id",
          });
        }
        if (!desk[0].isAvailable) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "cannot edit reserved desk",
          });
        }
        await db
          .update(desksTable)
          .set({
            isAvailable: false,
          })
          .where(eq(desksTable.id, input.id));
      } catch (error) {
        logger.error("failed to reservate a desk", { error });
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "failed to reservate desk",
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
        if (desk.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "failed to find desk with provided id",
          });
        }
        if (!desk[0].isAvailable) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "cannot edit reserved desk",
          });
        }

        await db
          .update(desksTable)
          .set({
            name: input.name,
          })
          .where(eq(desksTable.id, input.id));
      } catch (error) {
        logger.error("failed to update a desk", { error });
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "failed to edit desk",
          cause: error,
        });
      }
    }),
});
