import jwt from "jsonwebtoken";

import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

export const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(id);

    if (!user || user.token !== token || !user.token) {
      next(HttpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};
