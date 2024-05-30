import express from "express";
import validateBody from "../../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../../models/user.js";
import {
  login,
  register,
  logout,
  getCurrent,
  updateAvatar,
} from "../../controllers/auth.js";

import { authenticate } from "../../middlewares/authenticate.js";
import { upload } from "../../middlewares/upload.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), register);
usersRouter.post("/login", validateBody(loginSchema), login);
usersRouter.post("/logout", authenticate, logout);

usersRouter.get("/current", authenticate, getCurrent);

usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

export default usersRouter;
