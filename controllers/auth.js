import bcrypt from "bcrypt";
import * as fs from "node:fs/promises";
import path from "node:path";
import jwt from "jsonwebtoken";
import gravater from "gravatar";
import jimp from "jimp";

import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravater.url(email);

    const newUser = await User.create({
      email,
      password: hashPassword,
      avatarURL,
    });

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    await User.findByIdAndUpdate(user._id, { token }, { new: true });

    res.json({
      token,
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null }, { new: true });

    next(HttpError(204, "No Content"));
  } catch (error) {
    next(error);
  }
};
export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw next(HttpError(400, "File not found"));
    }
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const fileName = `${_id}_${originalname}`;
    const resultUpload = path.resolve("public", "avatars", fileName);

    const image = await jimp.read(tempUpload);
    await image.resize(250, 250).writeAsync(resultUpload);

    await fs.rename(tempUpload, resultUpload);
    
    const avatarURL = path.posix.join("avatars", fileName);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

// export const updateAvatar = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return next(HttpError(400, "File not found"));
//     }

//     const { _id } = req.user;
//     const { path: tempUpload, originalname } = req.file;
//     const fileName = `${_id}_${originalname}`;
//     const resultUpload = path.resolve("public", "avatars", fileName);

//     // Перевірка існування папки, якщо ні — створення
//     await fs.mkdir(path.resolve("public", "avatars"), { recursive: true });

//     // Обробка зображення до розміру 250x250
//     try {
//       const image = await jimp.read(tempUpload);
//       await image.resize(250, 250).writeAsync(resultUpload);
//       console.log("Image processed and resized");
//     } catch (imageError) {
//       throw next(HttpError(500, "Image processing error"));
//     }

//     // Переміщення обробленого зображення в папку "public/avatars"
//     try {
//       await fs.rename(tempUpload, resultUpload);
//       console.log("Image moved to destination folder");
//     } catch (renameError) {
//       throw next(HttpError(500, "File rename error"));
//     }

//     // Використовуємо path.posix.join для правильного формування URL
//     const avatarURL = path.posix.join("avatars", fileName);

//     // Оновлення URL аватара користувача в базі даних
//     try {
//       await User.findByIdAndUpdate(_id, { avatarURL });
//       console.log("User avatar URL updated in database");
//     } catch (dbError) {
//       throw next(HttpError(500, "Database update error"));
//     }

//     res.json({
//       avatarURL,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
