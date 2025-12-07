import { logger } from "../utils/logger";
import { pool } from "./db";

import { bookingTable } from "../modules/booking/booking.table";
import { userTable } from "../modules/user/user.table";
import { vehicleTable } from "../modules/vehicle/vehicle.table";

/**
 * Synchronize database schema with application
 * Creates all tables if they don't exist
 */
export const syncDatabase = async (): Promise<void> => {
  try {
    logger.info("Starting database synchronization...", {
      source: "Database Sync",
    });

    await userTable();
    await vehicleTable();
    await bookingTable();

    logger.info("Database synchronization completed successfully", {
      source: "Database Sync",
    });
  } catch (error) {
    logger.error("Database synchronization failed", {
      source: "Database Sync",
      error,
    });
  }
};

/**
 * Drop all tables
 */
export const dropAllTables = async (): Promise<void> => {
  try {
    logger.warn("Dropping all tables...", {
      source: "Database Sync",
    });

    // Drop in reverse order (respecting foreign key dependencies)
    await pool.query(`DROP TABLE IF EXISTS bookings CASCADE;`);

    await pool.query(`DROP TABLE IF EXISTS vehicles CASCADE;`);

    await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);

    logger.info("All tables dropped successfully", {
      source: "Database Sync",
    });
  } catch (error) {
    logger.error("Failed to drop tables", {
      source: "Database Sync",
      error,
    });
  }
};

/**
 * Reset database
 */
export const resetDatabase = async (): Promise<void> => {
  try {
    logger.warn("Resetting database...", {
      source: "Database Sync",
    });

    await dropAllTables();
    await syncDatabase();

    logger.info("Database reset completed successfully", {
      source: "Database Sync",
    });
  } catch (error) {
    logger.error("Database reset failed", {
      source: "Database Sync",
      error,
    });
    throw error;
  }
};
