import mongoose from "mongoose";
import { IUser, UserRole } from "../types/index.js";

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    fullName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    password: { 
      type: String, 
      required: true, 
      minlength: 6 
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.MEMBER,
      required: true,
    }
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;

