import User from "../models/User.js";
import { IUser } from "../types/index.js";

export class AuthRepository {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return await User.create(userData);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findUserById(id: string): Promise<IUser | null> {
    return await User.findById(id).select("-password");
  }

  async searchByEmail(emailQuery: string): Promise<Partial<IUser>[]> {
    return await User.find({
      email: { $regex: emailQuery, $options: "i" },
    }).select("_id fullName email role");
  }
}

