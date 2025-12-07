import { Router } from "express";
import validate from "../../middlewares/validate";
import { isLoggedIn } from "../../middlewares/verify";
import { loginHandler, meHandler, registerHandler } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

const authRouter = Router();

authRouter.post("/signup", validate(registerSchema), registerHandler);
authRouter.post("/signin", validate(loginSchema), loginHandler);
authRouter.get("/me", isLoggedIn, meHandler);

export default authRouter;
