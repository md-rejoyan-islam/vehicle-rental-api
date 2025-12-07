import { Request, Response } from "express";
import createError from "http-errors";
import { asyncHandler } from "../../utils/async-handler";
import { successResponse } from "../../utils/response-handler";
import { UserService } from "./user.service";
import { GetUsersQuery } from "./user.validation";

// Get all users (admin only)
export const getUsersHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await UserService.listUsers(req.query as GetUsersQuery);
    successResponse(res, {
      statusCode: 200,
      message: "Users fetched",
      payload: { data },
    });
  }
);

// GET user by ID (admin )
export const getUserByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const data = await UserService.getUserById(userId);
    successResponse(res, {
      statusCode: 200,
      message: "User fetched",
      payload: { data },
    });
  }
);

// Update user (admin can update any user, customer can update own profile)
export const updateUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const currentUserId = Number(req.user?.id);
    const userRole = req.user?.role as string;

    // Customers can only update their own profile
    if (userRole === "customer" && currentUserId !== userId) {
      throw createError.Forbidden("You can only update your own profile");
    }

    const data = await UserService.updateUser(userId, req.body);
    successResponse(res, {
      statusCode: 200,
      message: "User updated",
      payload: { data },
    });
  }
);

// Delete user (admin only, only if no active bookings)
export const deleteUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const data = await UserService.deleteUser(userId);
    successResponse(res, {
      statusCode: 200,
      message: "User deleted successfully",
    });
  }
);
