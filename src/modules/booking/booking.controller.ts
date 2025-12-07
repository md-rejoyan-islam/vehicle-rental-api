import { Request, Response } from "express";
import createError from "http-errors";
import { asyncHandler } from "../../utils/async-handler";
import { successResponse } from "../../utils/response-handler";
import { BookingService } from "./booking.service";
import { GetBookingsQuery } from "./booking.validation";

// Create booking (Customer or Admin)
export const createBookingHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.user?.id);
    const data = await BookingService.createBooking(userId, req.body);

    successResponse(res, {
      statusCode: 201,
      message: "Booking created successfully",
      payload: { data },
    });
  }
);

// Get all bookings (Admin: view all, Customer: view own only)
export const getBookingsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.user?.id);
    const userRole = req.user?.role as string;
    const query = req.query as GetBookingsQuery;

    let data;

    if (userRole === "admin") {
      // Admin can view all bookings
      data = await BookingService.getAllBookings(query);
    } else {
      // Customer can only view their own bookings
      data = await BookingService.getUserBookings(userId, {
        status: query.status as string,
      });
    }

    successResponse(res, {
      statusCode: 200,
      message: "Bookings fetched successfully",
      payload: { data },
    });
  }
);

// Update booking (Cancel or Return - role-based)
export const updateBookingHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const bookingId = Number(req.params.bookingId);
    const userId = Number(req.user?.id);
    const userRole = req.user?.role as string;
    const { action } = req.body; // "cancel" or "return"

    let data;

    if (action === "cancel") {
      // Customer can cancel before start date, Admin can cancel anytime
      data = await BookingService.cancelBooking(bookingId, userId, userRole);
    } else if (action === "return") {
      // Admin only - mark as returned
      if (userRole !== "admin") {
        throw createError.Forbidden(
          "Only admins can mark bookings as returned"
        );
      }
      data = await BookingService.returnBooking(bookingId);
    } else {
      throw createError.BadRequest("Invalid action. Use 'cancel' or 'return'");
    }

    successResponse(res, {
      statusCode: 200,
      message: `Booking ${action}ed successfully`,
      payload: { data },
    });
  }
);
