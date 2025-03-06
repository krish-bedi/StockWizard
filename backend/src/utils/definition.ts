import { JwtPayload as BaseJwtPayload } from "jsonwebtoken";
import { Request } from 'express';
import { Document } from "mongoose";

// Rename to CustomJwtPayload to avoid conflict
interface CustomJwtPayload extends BaseJwtPayload {
  userId?: string;
}

// Add this new interface
interface CustomRequest extends Request {
  user?: IUser; // You can make this more specific based on your user type
}

interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password?: string;  // Optional for OAuth users
    isVerified: boolean;
    imageUrl?: string;
    provider: 'local' | 'google';  // Add provider field
    providerId?: string;  // Store Google's user ID
    matchPassword(enteredPassword: string): Promise<boolean>;
}

export { CustomJwtPayload, CustomRequest, IUser };
