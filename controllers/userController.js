import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar";
import Jimp from "jimp";
import path from "path";
import { promises as fs } from "fs";

import * as userServices from "../services/userServices.js";

import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

const options = {
  default: "404",
};

export const signup = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userServices.findUser({ email });
    if (user) {
      throw HttpError(409, "Email already in use");
    }

    const avatarURL = gravatar.url(email, options);
    const newUser = await userServices.signup(req.body, avatarURL);

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userServices.findUser({ email });
    if (!user) {
      throw HttpError(401, "Email or password invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password invalid");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await userServices.setToken(user._id, token);

    res.json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription, avatarURL } = req.user;

    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await userServices.setToken(_id);

    res.json({
      message: "Signout success",
    });
  } catch (error) {
    next(error);
  }
};

const dir = path.resolve("public", "avatars");
export const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: filePath, filename } = req.file;

    //Отримання і вдалення старої аватарки
    const currentUser = await userServices.findUserById(_id);
    const oldAvatarPath = path.resolve(
      "public",
      currentUser.avatarURL.slice(1)
    );
    try {
      await fs.unlink(oldAvatarPath);
    } catch (error) {
      console.error(error.message);
    }
    //

    Jimp.read(filePath, (err, lenna) => {
      if (err) throw err;
      lenna.resize(250, 250).write(`${dir}/${filename}`);
    });
    const avatarURL = `/avatars/${filename}`;

    await userServices.updateAvatar(_id, avatarURL);
    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
