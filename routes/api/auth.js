import express from "express";
import validateBody from "../../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../../models/user.js";
import { login, register, logout, getCurrent } from "../../controllers/auth.js";

import { authenticate } from "../../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", authenticate, logout);

authRouter.get("/current", authenticate, getCurrent);

export default authRouter;
