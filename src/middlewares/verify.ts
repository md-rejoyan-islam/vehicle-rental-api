import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import secret from "../app/secret";
import { IJwtPayload } from "../app/types";
import { pool } from "../config/db";
import { asyncHandler } from "../utils/async-handler";

export const isLoggedIn = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token =
      req.headers?.authorization?.split("Bearer ")[1] || req.cookies?.token;

    if (!token || token === "null") {
      throw createError.Unauthorized("Please login to access this resource.");
    }

    const decoded = jwt.verify(
      token,
      secret.jwt.accessTokenSecret
    ) as IJwtPayload;

    const query = `SELECT id, role, email FROM users WHERE id = $1`;
    const result = await pool.query(query, [decoded.id]);

    if (result.rows.length === 0) {
      throw createError.Unauthorized(
        "Login User not found or no longer exists!"
      );
    }

    const user = result.rows[0];
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    next();
  }
);

export const isLoggedOut = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers?.authorization;
    const token = authHeader?.split(" ")[1];

    // check token
    const isValid = jwt.decode(token as string);

    if (isValid) {
      throw createError.Unauthorized("You are already logged in");
    }

    next();
  }
);
