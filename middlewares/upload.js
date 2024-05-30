import path from "node:path";
import multer from "multer";

const multerConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("tmp"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: multerConfig,
});
