import createError from "http-errors";
import { pool } from "../../config/db";
import { CreateBookingInput, GetBookingsQuery } from "./booking.validation";

// Create booking with price calculation
const createBooking = async (userId: number, payload: CreateBookingInput) => {
  const startDate = new Date(payload.rent_start_date);
  const endDate = new Date(payload.rent_end_date);

  // Validate dates
  if (startDate >= endDate) {
    throw createError.BadRequest("Rent end date must be after rent start date");
  }

  // Get vehicle details
  const vehicleQuery = `SELECT * FROM vehicles WHERE id = $1`;
  const vehicleResult = await pool.query(vehicleQuery, [payload.vehicle_id]);

  if (vehicleResult.rows.length === 0) {
    throw createError.NotFound("Vehicle not found");
  }

  const vehicle = vehicleResult.rows[0];

  // Check vehicle availability
  if (vehicle.availability_status !== "available") {
    throw createError.Conflict(
      "Vehicle is not available for booking during this period"
    );
  }

  // Calculate rental days
  const rentalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate total price
  const totalPrice = vehicle.daily_rent_price * rentalDays;

  // Create booking
  const query = `
    INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, created_at, updated_at
  `;
  const result = await pool.query(query, [
    userId,
    payload.vehicle_id,
    startDate,
    endDate,
    totalPrice,
    "active",
  ]);

  const booking = result.rows[0];

  // Update vehicle availability
  await pool.query(
    `UPDATE vehicles SET availability_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
    ["booked", payload.vehicle_id]
  );

  return booking;
};

// Get all bookings (admin only)
const getAllBookings = async (query: GetBookingsQuery) => {
  const { status, sortBy = "created_at", sortOrder = "desc" } = query;

  let queryStr = `SELECT * FROM bookings WHERE 1=1`;
  const params: (string | number)[] = [];
  let paramIndex = 1;

  if (status) {
    queryStr += ` AND status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  const sortOrder_ = sortOrder === "asc" ? "ASC" : "DESC";
  queryStr += ` ORDER BY ${sortBy} ${sortOrder_}`;

  const result = await pool.query(queryStr, params);
  return result.rows;
};

// Get user's bookings
const getUserBookings = async (
  userId: number,
  query: {
    status?: string;
  }
) => {
  let queryStr = `SELECT * FROM bookings WHERE customer_id = $1`;
  const params: (string | number | undefined)[] = [userId];
  let paramIndex = 2;

  if (query.status) {
    queryStr += ` AND status = $${paramIndex}`;
    params.push(query.status);
    paramIndex++;
  }

  queryStr += ` ORDER BY created_at DESC`;

  const result = await pool.query(queryStr, params);
  return result.rows;
};

// Get booking by ID (internal use)
const getBookingById = async (id: number) => {
  const query = `SELECT * FROM bookings WHERE id = $1`;
  const result = await pool.query(query, [id]);
  const booking = result.rows[0];

  if (!booking) {
    throw createError.NotFound("Booking not found");
  }

  return booking;
};

// Cancel booking (customer can cancel before start date, admin can cancel anytime)
const cancelBooking = async (id: number, userId: number, userRole: string) => {
  const query = `SELECT * FROM bookings WHERE id = $1`;
  const result = await pool.query(query, [id]);
  const booking = result.rows[0];

  if (!booking) {
    throw createError.NotFound("Booking not found");
  }

  // Customers can only cancel their own bookings
  if (userRole === "customer" && booking.customer_id !== userId) {
    throw createError.Forbidden(
      "You do not have permission to cancel this booking"
    );
  }

  if (booking.status === "cancelled") {
    throw createError.BadRequest("Booking is already cancelled");
  }

  if (booking.status === "returned") {
    throw createError.BadRequest("Cannot cancel a returned booking");
  }

  // Customers can only cancel before the rental starts
  if (userRole === "customer") {
    const startDate = new Date(booking.rent_start_date);
    const now = new Date();

    if (now >= startDate) {
      throw createError.BadRequest(
        "Booking cannot be cancelled after the rental start date"
      );
    }
  }

  // Update vehicle availability
  await pool.query(
    `UPDATE vehicles SET availability_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
    ["available", booking.vehicle_id]
  );

  const updateQuery = `
    UPDATE bookings 
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, created_at, updated_at
  `;

  const updateResult = await pool.query(updateQuery, ["cancelled", id]);
  return updateResult.rows[0];
};

// Return booking (mark as returned)
const returnBooking = async (id: number) => {
  const query = `SELECT * FROM bookings WHERE id = $1`;
  const result = await pool.query(query, [id]);
  const booking = result.rows[0];

  if (!booking) {
    throw createError.NotFound("Booking not found");
  }

  if (booking.status !== "active") {
    throw createError.BadRequest(`Cannot return a ${booking.status} booking`);
  }

  // Update vehicle availability
  await pool.query(
    `UPDATE vehicles SET availability_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
    ["available", booking.vehicle_id]
  );

  const updateQuery = `
    UPDATE bookings 
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, created_at, updated_at
  `;

  const updateResult = await pool.query(updateQuery, ["returned", id]);
  return updateResult.rows[0];
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  cancelBooking,
  returnBooking,
};
