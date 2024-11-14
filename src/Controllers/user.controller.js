import {asyncHandler} from "../Utils/asyncHandler.js";
import {User} from "../Models/user.model.js";
import {ApiError} from "../Utils/apiError.js";
import {validateConfirmPassword, validateEmail, validatePassword} from "../Utils/user.utils.js";
import {ApiResponse} from "../Utils/apiResponse.js";

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

export {handleGetUserDetails, handleRegisterUser};