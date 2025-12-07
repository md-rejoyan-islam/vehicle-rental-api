import createError from "http-errors";
import { pool } from "../../config/db";
import {
  CreateVehicleInput,
  GetVehiclesQuery,
  UpdateVehicleInput,
} from "./vehicle.validation";

// Create vehicle
const createVehicle = async (payload: CreateVehicleInput) => {
  // Check if registration number already exists
  const checkQuery = `SELECT id FROM vehicles WHERE registration_number = $1`;
  const checkResult = await pool.query(checkQuery, [
    payload.registration_number,
  ]);

  if (checkResult.rows.length > 0) {
    throw createError.Conflict(
      "Vehicle with this registration number already exists"
    );
  }

  const query = `
    INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status, created_at, updated_at
  `;
  const result = await pool.query(query, [
    payload.vehicle_name,
    payload.type,
    payload.registration_number,
    payload.daily_rent_price,
    "available",
  ]);

  return result.rows[0];
};

// Get all vehicles
const getAllVehicles = async (query: GetVehiclesQuery) => {
  const {
    search,
    type,
    availability_status,
    sortBy = "created_at",
    sortOrder = "desc",
  } = query;

  let queryStr = `SELECT * FROM vehicles WHERE 1=1`;
  const params: (string | number)[] = [];
  let paramIndex = 1;

  if (availability_status) {
    queryStr += ` AND availability_status = $${paramIndex}`;
    params.push(availability_status);
    paramIndex++;
  }

  if (type) {
    queryStr += ` AND type = $${paramIndex}`;
    params.push(type);
    paramIndex++;
  }

  if (search) {
    queryStr += ` AND (vehicle_name ILIKE $${paramIndex} OR registration_number ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  const sortOrder_ = sortOrder === "asc" ? "ASC" : "DESC";
  queryStr += ` ORDER BY ${sortBy} ${sortOrder_}`;

  const result = await pool.query(queryStr, params);
  return result.rows;
};

// Get vehicle by ID
const getVehicleById = async (id: number) => {
  const query = `SELECT * FROM vehicles WHERE id = $1`;
  const result = await pool.query(query, [id]);
  const vehicle = result.rows[0];

  if (!vehicle) {
    throw createError.NotFound("Vehicle not found");
  }

  return vehicle;
};

// Update vehicle
const updateVehicle = async (id: number, payload: UpdateVehicleInput) => {
  const checkQuery = `SELECT * FROM vehicles WHERE id = $1`;
  const checkResult = await pool.query(checkQuery, [id]);
  const vehicle = checkResult.rows[0];

  if (!vehicle) {
    throw createError.NotFound("Vehicle not found");
  }

  // Check if registration number is being updated and if it already exists
  if (
    payload.registration_number &&
    payload.registration_number !== vehicle.registration_number
  ) {
    const dupCheckQuery = `SELECT id FROM vehicles WHERE registration_number = $1 AND id != $2`;
    const dupCheckResult = await pool.query(dupCheckQuery, [
      payload.registration_number,
      id,
    ]);

    if (dupCheckResult.rows.length > 0) {
      throw createError.Conflict(
        "Vehicle with this registration number already exists"
      );
    }
  }

  const fields: string[] = [];
  const params: (string | number | undefined)[] = [];
  let paramIndex = 1;

  if (payload.vehicle_name !== undefined) {
    fields.push(`vehicle_name = $${paramIndex}`);
    params.push(payload.vehicle_name);
    paramIndex++;
  }

  if (payload.type !== undefined) {
    fields.push(`type = $${paramIndex}`);
    params.push(payload.type);
    paramIndex++;
  }

  if (payload.registration_number !== undefined) {
    fields.push(`registration_number = $${paramIndex}`);
    params.push(payload.registration_number);
    paramIndex++;
  }

  if (payload.daily_rent_price !== undefined) {
    fields.push(`daily_rent_price = $${paramIndex}`);
    params.push(payload.daily_rent_price);
    paramIndex++;
  }

  if (payload.availability_status !== undefined) {
    fields.push(`availability_status = $${paramIndex}`);
    params.push(payload.availability_status);
    paramIndex++;
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  params.push(id);

  const query = `
    UPDATE vehicles 
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status, created_at, updated_at
  `;

  const result = await pool.query(query, params);
  return result.rows[0];
};

// Delete vehicle
const deleteVehicle = async (id: number) => {
  const checkQuery = `SELECT * FROM vehicles WHERE id = $1`;
  const checkResult = await pool.query(checkQuery, [id]);
  const vehicle = checkResult.rows[0];

  if (!vehicle) {
    throw createError.NotFound("Vehicle not found");
  }

  // Check if vehicle is currently booked
  if (vehicle.availability_status === "booked") {
    throw createError.BadRequest(
      "Cannot delete a booked vehicle. Please cancel related bookings first."
    );
  }

  await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
  return { success: true };
};

// Check if vehicle has active bookings
const hasActiveBookings = async (vehicleId: number) => {
  const query = `SELECT COUNT(*) as count FROM bookings WHERE vehicle_id = $1 AND status = 'active'`;
  const result = await pool.query(query, [vehicleId]);
  return result.rows[0].count > 0;
};

export const VehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  hasActiveBookings,
};
