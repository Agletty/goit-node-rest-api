import express from "express";
import validateBody from "../../helpers/validateBody.js";
import { registerSchema, loginSchema, emailSchema } from "../../models/user.js";
import {
  login,
  register,
  logout,
  getCurrent,
  updateAvatar,
  resendVerifyEmail,
  verifyEmail,
} from "../../controllers/auth.js";

import { authenticate } from "../../middlewares/authenticate.js";
import { upload } from "../../middlewares/upload.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), register);
usersRouter.post("/login", validateBody(loginSchema), login);
usersRouter.post("/logout", authenticate, logout);
usersRouter.post("/verify", validateBody(emailSchema), resendVerifyEmail);

usersRouter.get("/current", authenticate, getCurrent);
usersRouter.get("/verify/:verificationToken", verifyEmail);

usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

export default usersRouter;
