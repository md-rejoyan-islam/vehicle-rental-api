import { JwtPayload } from "jsonwebtoken";
import { ROLE } from "../modules/user/user.type";

export interface ISuccessResponse {
  statusCode?: number;
  message?: string;
  payload?: object;
}

export interface IErrorResponse {
  success: boolean;
  message: string;
  errors: { path: string | number; message: string }[];
  stack?: string;
}

export interface IJwtPayload extends JwtPayload {
  id: number;
  email: string;
  role: ROLE;
}
