import { Router } from "express";
import validate from "../../middlewares/validate";
import { isLoggedIn } from "../../middlewares/verify";
import {
  createBookingHandler,
  getBookingsHandler,
  updateBookingHandler,
} from "./booking.controller";
import {
  createBookingSchema,
  getBookingsQuerySchema,
  updateBookingSchema,
} from "./booking.validation";

const bookingRouter = Router();
bookingRouter.use(isLoggedIn);

// Create booking (Customer or Admin)
bookingRouter.post("/", validate(createBookingSchema), createBookingHandler);

// Get all bookings (Admin: all, Customer: own)
bookingRouter.get("/", validate(getBookingsQuerySchema), getBookingsHandler);

// Update booking (Cancel or Return - role-based)
bookingRouter.put(
  "/:bookingId",
  validate(updateBookingSchema),
  updateBookingHandler
);

export default bookingRouter;
