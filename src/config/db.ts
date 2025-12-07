import pg from "pg";
import secret from "../app/secret";
import { logger } from "../utils/logger";

export const pool = new pg.Pool({
  connectionString: secret.pg_uri,
});

export const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    client.release();

    logger.info("PostgreSQL connected successfully", {
      source: "Database",
    });
  } catch (error) {
    logger.error("PostgreSQL connection failed", {
      source: "Database",
      error,
    });
    process.exit(1);
  }
};
