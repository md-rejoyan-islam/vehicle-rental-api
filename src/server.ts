import app from "./app/app";
import secret from "./app/secret";
import { connectDB } from "./config/db";
import { syncDatabase } from "./config/db-sync";
import { logger } from "./utils/logger";

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Synchronize database schema (create tables if they don't exist)
    await syncDatabase();

    // Start server
    app.listen(secret.port, () => {
      logger.info(`Server running on port ${secret.port}`, {
        source: "Server",
      });
    });
  } catch (error) {
    console.log(error);

    logger.error("Failed to start server", {
      source: "Server",
      error,
    });
    process.exit(1);
  }
};

startServer();
