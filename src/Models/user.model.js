import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name required"],
    trim: true,
  },
  roll: {
    type: String,
    required: [true, "Roll no required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email required"],
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["USER", "MODERATOR", "ADMIN"],
    default: "USER",
  },
  border: {
    type: Number,
  },
  department: {
    type: String,
  },
  address: {
    type: String,
  },
  mobile: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  password: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
}, {timestamps: true});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({
    _id: this._id,
    name: this.name,
    email: this.email,
  }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({
    _id: this._id,
  }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const User = mongoose.model("User", userSchema);