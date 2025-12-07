import { Request, Response } from "express";
import createError from "http-errors";
import { asyncHandler } from "../../utils/async-handler";
import { successResponse } from "../../utils/response-handler";
import { VehicleService } from "./vehicle.service";
import { GetVehiclesQuery } from "./vehicle.validation";

// Create vehicle (admin only)
export const createVehicleHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await VehicleService.createVehicle(req.body);

    successResponse(res, {
      statusCode: 201,
      message: "Vehicle created successfully",
      payload: { data },
    });
  }
);

// Get all vehicles (public)
export const getVehiclesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await VehicleService.getAllVehicles(
      req.query as GetVehiclesQuery
    );

    successResponse(res, {
      statusCode: 200,
      message: "Vehicles fetched successfully",
      payload: { data },
    });
  }
);

// Get vehicle by ID (public)
export const getVehicleByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const vehicleId = Number(req.params.vehicleId);
    const data = await VehicleService.getVehicleById(vehicleId);

    successResponse(res, {
      statusCode: 200,
      message: "Vehicle fetched successfully",
      payload: { data },
    });
  }
);

// Update vehicle (admin only)
export const updateVehicleHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const vehicleId = Number(req.params.vehicleId);
    const data = await VehicleService.updateVehicle(vehicleId, req.body);

    successResponse(res, {
      statusCode: 200,
      message: "Vehicle updated successfully",
      payload: { data },
    });
  }
);

// Delete vehicle (admin only, only if no active bookings)
export const deleteVehicleHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const vehicleId = Number(req.params.vehicleId);

    // Check if vehicle has active bookings
    const hasActiveBookings = await VehicleService.hasActiveBookings(vehicleId);
    if (hasActiveBookings) {
      throw createError.Conflict("Cannot delete vehicle with active bookings");
    }

    const data = await VehicleService.deleteVehicle(vehicleId);

    successResponse(res, {
      statusCode: 200,
      message: "Vehicle deleted successfully",
      payload: data,
    });
  }
);
