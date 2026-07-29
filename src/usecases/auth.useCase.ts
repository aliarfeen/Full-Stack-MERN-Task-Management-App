import bcrypt from "bcryptjs";
import { AuthRepository } from "../repositories/auth.repository.js";
import { AppError } from "../lib/appError.js";
import { IUser, UserRole } from "../types/index.js";


export class AuthUseCase {
  private authRepo: AuthRepository;

  constructor() {
    this.authRepo = new AuthRepository();
  }

  async registerUser(userData: Partial<IUser>): Promise<IUser> {
    const { fullName, email, password } = userData;

    if (!fullName || !email || !password) {
      throw new AppError("Missing details", 400);
    }

    const exists = await this.authRepo.findUserByEmail(email);
    if (exists) {
      throw new AppError("User already exists", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return await this.authRepo.createUser({
      fullName,
      email,
      password: hashedPassword,
      role: UserRole.MEMBER,
    });
  }


  async loginUser(email?: string, password?: string): Promise<IUser> {
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await this.authRepo.findUserByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    return user;
  }
}
