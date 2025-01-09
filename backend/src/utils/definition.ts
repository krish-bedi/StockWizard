import { JwtPayload as BaseJwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";

interface JwtPayload extends BaseJwtPayload {
  userId?: string;
}

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  imageUrl: string;
}

export { JwtPayload, IUser };
