import express from "express";
import {handleGetUserDetails, handleLoginUser, handleRegisterUser} from "../Controllers/user.controller.js";

const userRouter = express.Router();

userRouter.route("").get(handleGetUserDetails);
userRouter.route("/register").post(handleRegisterUser);
userRouter.route("/login").post(handleLoginUser);

export default userRouter;