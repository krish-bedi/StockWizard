import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Token from "../models/tokenModel";
import { IUser } from "../utils/definition";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
    },
    provider: {
      type: String,
      required: true,
      enum: ['local', 'google'],
    },
    providerId: {
      type: String,
      sparse: true,
      index: true
    },
  },
  {
    timestamps: true,
  }
);

// Hash password
userSchema.pre("save", async function (next) {
  // Skip hashing if password isn't modified or if it's an OAuth user
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  if (this.provider !== 'local') {
    return false;  // OAuth users can't use password login
  }
  return this.password ? await bcrypt.compare(enteredPassword, this.password) : false;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
