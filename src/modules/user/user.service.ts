import createError from "http-errors";
import { pool } from "../../config/db";
import { GetUsersQuery } from "./user.validation";

// Get all users (admin only)
const listUsers = async (query: GetUsersQuery) => {
  const {
    search,
    role,
    sortBy = "created_at",
    sortOrder = "desc",
  } = query || {};

  let queryStr = `SELECT id, name,  email, phone, role, created_at, updated_at FROM users WHERE 1=1`;
  const params: (string | number)[] = [];
  let paramIndex = 1;

  if (role) {
    queryStr += ` AND role = $${paramIndex}`;
    params.push(role);
    paramIndex++;
  }

  if (search) {
    queryStr += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  const sortOrder_ = sortOrder === "asc" ? "ASC" : "DESC";
  queryStr += ` ORDER BY ${sortBy} ${sortOrder_}`;

  const result = await pool.query(queryStr, params);
  return result.rows;
};

// Get user by ID
const getUserById = async (id: number) => {
  const query = `SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = $1`;
  const result = await pool.query(query, [id]);
  const user = result.rows[0];

  if (!user) {
    throw createError.NotFound("User not found");
  }

  return user;
};

// Update user
const updateUser = async (
  id: number,
  payload: {
    name?: string;
    phone?: string;
  }
) => {
  const checkQuery = `SELECT id FROM users WHERE id = $1`;
  const checkResult = await pool.query(checkQuery, [id]);

  if (checkResult.rows.length === 0) {
    throw createError.NotFound("User not found");
  }

  const fields: string[] = [];
  const params: (string | number | undefined)[] = [];
  let paramIndex = 1;

  if (payload.name !== undefined) {
    fields.push(`name = $${paramIndex}`);
    params.push(payload.name);
    paramIndex++;
  }

  if (payload.phone !== undefined) {
    fields.push(`phone = $${paramIndex}`);
    params.push(payload.phone);
    paramIndex++;
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  params.push(id);

  const query = `
    UPDATE users 
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING id, name, email, phone, role, password, created_at, updated_at
  `;

  const result = await pool.query(query, params);
  return result.rows[0];
};

// Delete user
const deleteUser = async (id: number) => {
  const checkQuery = `SELECT id FROM users WHERE id = $1`;
  const checkResult = await pool.query(checkQuery, [id]);

  if (checkResult.rows.length === 0) {
    throw createError.NotFound("User not found");
  }

  await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return { success: true };
};

export const UserService = {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};
