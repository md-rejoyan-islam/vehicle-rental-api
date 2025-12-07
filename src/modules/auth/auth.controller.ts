import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { successResponse } from "../../utils/response-handler";
import { AuthService } from "./auth.service";

export const registerHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await AuthService.register(req.body);
    successResponse(res, {
      statusCode: 201,
      message: "User registered successfully",
      payload: { data },
    });
  }
);

export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };
    const data = await AuthService.login(email, password);
    successResponse(res, {
      statusCode: 200,
      message: "Login successful",
      payload: { data },
    });
  }
);

export const meHandler = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  const data = await AuthService.me(userId);
  successResponse(res, {
    statusCode: 200,
    message: "Profile fetched",
    payload: { data },
  });
});
