import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import crypto from 'crypto';
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import appRoutes from "./routes/appRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import connectDB from "./config/db";

dotenv.config();

connectDB();

const app = express();

// Generate a random cookie secret if not provided
const cookieSecret = process.env.COOKIE_SECRET || crypto.randomBytes(32).toString('hex');

app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(cookieSecret));

app.use("/api/users", userRoutes);
app.use("/api/app", appRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
