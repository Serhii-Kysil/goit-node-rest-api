import express from "express";

import {
  signup,
  signin,
  getCurrent,
  signout,
} from "../controllers/authController.js";

import authtenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", signup);

authRouter.post("/login", signin);

authRouter.get("/current", authtenticate, getCurrent);

authRouter.post("/logout", authtenticate, signout);

export default authRouter;
