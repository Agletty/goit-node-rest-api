import HttpError from "./HttpError.js";
import mongoose from "mongoose";

const validateObjectId = (req, _, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(HttpError(400, "Invalid contact id"));
  }

  next();
};

export default validateObjectId;
