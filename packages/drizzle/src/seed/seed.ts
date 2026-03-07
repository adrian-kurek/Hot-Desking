import { initDesksData } from "./initDesksData";
import { desksTable } from "../db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema";
import dotenv from "dotenv";
import path from "path";
import { logger } from "../logger";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
const databaseURL = process.env.DATABASE_URL;

if (!databaseURL) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

const dbConnection = drizzle(databaseURL, { schema });

async function loadDBData() {
  logger.info("Starting database seeding", { databaseURL });
  logger.info("Cleaning database");

  await dbConnection.delete(desksTable);
  logger.info("Started inserting dessks data", { initDesksData });
  for (const desk of initDesksData) {
    const newDesk = await dbConnection
      .insert(desksTable)
      .values(desk)
      .returning({ id: desksTable.id });
    logger.info("Inserted desk", { id: newDesk[0].id, name: desk.name });
  }
  logger.info("Finished database seeding");
  process.exit(0);
}
loadDBData();
