import {ApiError} from "../Utils/apiError.js";
import jwt from "jsonwebtoken";
import {User} from "../Models/user.model.js";

export const varifyJWT = async (req, _, next) => {
  try {
    const token = req?.cookie?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.decode(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    req.user = user;
    next();
  } catch (e) {
    throw new ApiError(400, e.message || e.body);
  }
};