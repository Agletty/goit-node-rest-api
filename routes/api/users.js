import express from "express";
import validateBody from "../../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../../models/user.js";
import { login, register, logout, getCurrent } from "../../controllers/auth.js";

import { authenticate } from "../../middlewares/authenticate.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), register);
usersRouter.post("/login", validateBody(loginSchema), login);
usersRouter.post("/logout", authenticate, logout);

usersRouter.get("/current", authenticate, getCurrent);

export default usersRouter;
