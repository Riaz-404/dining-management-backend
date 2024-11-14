import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name required"],
    trim: true,
  },
  roll: {
    type: Number,
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

export const User = mongoose.model("User", userSchema);