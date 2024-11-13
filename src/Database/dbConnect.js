import mongoose from "mongoose";
import {DB_NAME, MONGODB_URI} from "../constant.js";

const dbConnect = () => {
  return mongoose.connect(MONGODB_URI, {
    dbName: DB_NAME,
  });
};

export default dbConnect;