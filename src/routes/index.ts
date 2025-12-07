import { Request, Response, Router } from "express";
import createError from "http-errors";

import errorHandler from "../middlewares/error-handler";
import authRouter from "../modules/auth/auth.route";
import bookingRouter from "../modules/booking/booking.route";
import userRouter from "../modules/user/user.route";
import vehicleRouter from "../modules/vehicle/vehicle.route";
import { successResponse } from "../utils/response-handler";

const router = Router();

// home route
router.get("/", (_: Request, res: Response) => {
  successResponse(res, {
    message: "Welcome to Vehicle Rental Service API!",
    statusCode: 200,
  });
});

// health check route
router.get("/health", (_: Request, res: Response) => {
  successResponse(res, {
    message: "Service is running smoothly!",
    statusCode: 200,
  });
});

// auth routes
router.use("/api/v1/auth", authRouter);

// user routes
router.use("/api/v1/users", userRouter);

// vehicle routes
router.use("/api/v1/vehicles", vehicleRouter);

// booking routes
router.use("/api/v1/bookings", bookingRouter);

// 404 route
router.use("", (req: Request, _res: Response) => {
  throw createError.NotFound(
    `Did not find the requested resource- ${req.originalUrl}`
  );
});

// error handler
router.use(errorHandler);

export default router;
