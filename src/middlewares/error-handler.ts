import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import {
  InternalServerError,
  isHttpError,
  Unauthorized,
  UnprocessableEntity,
} from "http-errors";
import secret from "../app/secret";
import { IErrorResponse } from "../app/types";
import { logger } from "../utils/logger";

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode: number = InternalServerError().statusCode;
  let message = "Something went wrong!";
  let errors: { path: string | number; message: string }[] = [];

  // start jwt error
  if (error.name === "JsonWebTokenError") {
    statusCode = Unauthorized().statusCode;
    error.message = "Invalid token. Please log in again!";
    errors = [{ path: "", message: "Invalid token. Please log in again!" }];
  }
  // handle JWT expired errors
  if (error.name === "TokenExpiredError") {
    statusCode = Unauthorized().statusCode;
    error.message = "Your token has expired! Please log in again.";
    errors = [
      { path: "", message: "Your token has expired! Please log in again." },
    ];
  }

  // handle Zod validation errors
  if (error instanceof ZodError) {
    statusCode = UnprocessableEntity().statusCode;
    message = error.issues[0].message;

    errors = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }

  // handle errors from the http-errors library
  else if (isHttpError(error)) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.message ? [{ path: "", message: error.message }] : [];
  }
  // handle generic Error
  else if (error instanceof Error) {
    message = error.message;
    errors = error.message ? [{ path: "", message: error.message }] : [];
  }

  const response: IErrorResponse = {
    success: false,
    message,
    errors,
  };

  // in development, include the stack trace
  if (secret.node_env !== "production") {
    response.stack = error.stack;
  }

  logger.error({
    message: error.message,
    name: error.name,
    stack: error.stack,
    status: statusCode,
  });

  res.status(statusCode).json(response);
};

export default errorHandler;
