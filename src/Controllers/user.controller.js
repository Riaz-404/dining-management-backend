import {asyncHandler} from "../Utils/asyncHandler.js";
import {User} from "../Models/user.model.js";
import {ApiError} from "../Utils/apiError.js";
import {validateConfirmPassword, validateEmail, validatePassword} from "../Utils/user.utils.js";
import {ApiResponse} from "../Utils/apiResponse.js";
import jwt from "jsonwebtoken";

const handleGetUserDetails = asyncHandler((req, res) => {
  const _id = req.query.id;

  console.log(_id);
});

const handleRegisterUser = asyncHandler(async (req, res) => {
  const userInfo = req.body;

  // check for all fields
  if (!userInfo.name || !userInfo.roll || !userInfo.email || !userInfo.password) {
    throw new ApiError(400, "All fields are required");
  }

  // check for existing user
  const existingUser = await User.find({
    $or: [
      {roll: userInfo.roll},
      {email: userInfo.email},
    ],
  });

  if (existingUser.length > 0) throw new ApiError(409, "User already existed");

  // validate email password format
  if (!validateEmail(userInfo.email)) {
    throw new ApiError(400, "Invalid email address");
  }

  if (!validatePassword(userInfo.password)) {
    throw new ApiError(400, "Password format missing");
  }

  // validate confirm password match
  if (!validateConfirmPassword(userInfo.password, userInfo.confirmPassword)) {
    throw new ApiError(400, "Password do not match");
  }

  const createdUser = await User.create(userInfo);

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});


const handleLoginUser = asyncHandler(async (req, res) => {
  const userInfo = req.body;

  // check for all fields
  if (!userInfo.roll || !userInfo.password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({roll: userInfo.roll});

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(userInfo.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password incorrect");
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken};
  } catch (e) {
    throw new ApiError(400, e.message || e.body);
  }
};

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req?.cookie?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(404, "Token not found");
  }

  try {
    const decodedRefreshToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedRefreshToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, "Access token refreshed"));
  } catch (e) {
    throw new ApiError(400, e.message || e.body);
  }
});

export {handleGetUserDetails, handleRegisterUser, handleLoginUser, refreshAccessToken};