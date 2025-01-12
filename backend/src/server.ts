import cors from "cors";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import appRoutes from "./routes/appRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import connectDB from "./config/db";

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use('/api/app', appRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
