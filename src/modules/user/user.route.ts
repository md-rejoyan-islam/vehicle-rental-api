import { Router } from "express";
import { authorize } from "../../middlewares/authorized";
import validate from "../../middlewares/validate";
import { isLoggedIn } from "../../middlewares/verify";
import {
  deleteUserHandler,
  getUserByIdHandler,
  getUsersHandler,
  updateUserHandler,
} from "./user.controller";
import { deleteUserSchema, updateUserSchema } from "./user.validation";

const userRouter = Router();
userRouter.use(isLoggedIn);

// Get all users (admin only)
userRouter.get("/", authorize(["admin"]), getUsersHandler);

// Update user (admin can update any user, customer can update own profile)
userRouter.put("/:userId", validate(updateUserSchema), updateUserHandler);

// GET User by ID (admin can get any user)
userRouter.get("/:userId", authorize(["admin"]), getUserByIdHandler);

// Delete user (admin only)
userRouter.delete(
  "/:userId",
  authorize(["admin"]),
  validate(deleteUserSchema),
  deleteUserHandler
);

export default userRouter;
