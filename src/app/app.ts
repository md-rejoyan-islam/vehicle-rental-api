import cors from "cors";
import express, { Application } from "express";
import morgan, { StreamOptions } from "morgan";
import path from "path";
import corsOptions from "../config/cors";
import limiter from "../config/rate-limiter";
import router from "../routes";
import { logger } from "../utils/logger";

const app: Application = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files
app.use("/public", express.static(path.join(process.cwd(), "/public/")));

// CORS configuration
app.use(cors(corsOptions));

const stream: StreamOptions = {
  write: (message) => logger.http(message.trim()),
};

// morgan
if (process.env.NODE_ENV === "development") {
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms", {
      stream,
    })
  );
}

// rate limiter
app.use(limiter);

// routes
app.use(router);

export default app;
