import createError from "http-errors";
import secret from "../../app/secret";
import { IJwtPayload } from "../../app/types";
import { pool } from "../../config/db";
import generateToken from "../../utils/generate-token";
import { comparePassword, hashPassword } from "../../utils/password";
import { RegisterInput } from "./auth.validation";

// Register new user
const register = async (payload: RegisterInput) => {
  // Check if user exists
  const checkQuery = `SELECT id FROM users WHERE email = $1`;
  const checkResult = await pool.query(checkQuery, [payload.email]);

  if (checkResult.rows.length > 0) {
    throw createError.Conflict("Email already exists");
  }

  const hashedPassword = await hashPassword(payload.password);

  const query = `
    INSERT INTO users (name, email, phone, password, role, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id, name, email, phone, role
  `;

  const result = await pool.query(query, [
    payload.name,
    payload.email.toLowerCase(),
    payload.phone,
    hashedPassword,
    payload.role || "customer",
  ]);

  return result.rows[0];
};

// Login user
const login = async (email: string, password: string) => {
  const query = `SELECT id, password, role, email, name, phone FROM users WHERE email = $1`;
  const result = await pool.query(query, [email.toLowerCase()]);

  if (result.rows.length === 0) {
    throw createError.Unauthorized("User not found");
  }

  const user = result.rows[0];
  const match = await comparePassword(password, user.password || "");

  if (!match) {
    throw createError.Unauthorized("Invalid email or password");
  }

  const accessPayload: IJwtPayload = {
    id: user.id.toString(),
    role: user.role,
    email: user.email,
  };

  const token = generateToken(accessPayload, {
    secret: secret.jwt.accessTokenSecret,
    expiresIn: secret.jwt.accessTokenExpiresIn,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
    },
  };
};

// Get user profile
const me = async (userId: number) => {
  const query = `SELECT id, name, email, phone, role, password, created_at, updated_at FROM users WHERE id = $1`;
  const result = await pool.query(query, [userId]);

  if (result.rows.length === 0) {
    throw createError.NotFound("User not found");
  }

  return result.rows[0];
};

export const AuthService = {
  register,
  login,
  me,
};
