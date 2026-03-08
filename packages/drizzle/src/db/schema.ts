import { pgTable, boolean, varchar, uuid } from "drizzle-orm/pg-core";

export const desksTable = pgTable("desks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
});

export const schema = {
  desksTable,
};
