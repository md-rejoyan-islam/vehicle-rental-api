import { Router } from "express";
import { authorize } from "../../middlewares/authorized";
import validate from "../../middlewares/validate";
import { isLoggedIn } from "../../middlewares/verify";
import {
  createVehicleHandler,
  deleteVehicleHandler,
  getVehicleByIdHandler,
  getVehiclesHandler,
  updateVehicleHandler,
} from "./vehicle.controller";
import {
  createVehicleSchema,
  getVehiclesQuerySchema,
  updateVehicleSchema,
} from "./vehicle.validation";

const vehicleRouter = Router();

// Add new vehicle (admin only)
vehicleRouter.post(
  "/",
  isLoggedIn,
  authorize(["admin"]),
  validate(createVehicleSchema),
  createVehicleHandler
);

// Get all vehicles (public)
vehicleRouter.get("/", validate(getVehiclesQuerySchema), getVehiclesHandler);

// Get vehicle (public)
vehicleRouter.get("/:vehicleId", getVehicleByIdHandler);
// Update vehicle (admin only)
vehicleRouter.put(
  "/:vehicleId",
  isLoggedIn,
  authorize(["admin"]),
  validate(updateVehicleSchema),
  updateVehicleHandler
);

// Delete vehicle (admin only, only if no active bookings)
vehicleRouter.delete(
  "/:vehicleId",
  isLoggedIn,
  authorize(["admin"]),
  deleteVehicleHandler
);

export default vehicleRouter;
