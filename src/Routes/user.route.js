import express from "express";
import {handleGetUserDetails, handleRegisterUser} from "../Controllers/user.controller.js";

const userRouter = express.Router();

userRouter.route("").get(handleGetUserDetails);
userRouter.route("/register").post(handleRegisterUser);

export default userRouter;