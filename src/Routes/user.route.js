import express from "express";
import {
  handleGetUserDetails,
  handleLoginUser,
  handleRegisterUser,
  refreshAccessToken,
} from "../Controllers/user.controller.js";
import {varifyJWT} from "../Middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.route("").get(varifyJWT, handleGetUserDetails);
userRouter.route("/register").post(handleRegisterUser);
userRouter.route("/login").post(handleLoginUser);
userRouter.route("/refreshToken").post(refreshAccessToken);

export default userRouter;