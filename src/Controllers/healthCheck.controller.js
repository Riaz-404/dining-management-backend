import {asyncHandler} from "../Utils/asyncHandler.js";
import {ApiResponse} from "../Utils/apiResponse.js";

const healthCheck = asyncHandler((req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "OK", "Health Check Passed"));
});

export default healthCheck;