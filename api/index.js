import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

//  Import Routes
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

import listingRouter from './routes/listing.route.js';

import utilsRouter from './routes/utils.route.js';

//  Initialize Environment Variables
dotenv.config({ path: './api/.env' });

//  Initialize Express App
const app = express();

// ============================
//  Middleware
// ============================

// Enable CORS for frontend origin
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Parse incoming JSON and cookies
app.use(cookieParser());
app.use(express.json());

// ============================
//  Routes
// ============================
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing",listingRouter);
//import utilsRouter from './routes/utils.route.js';
app.use('/api/utils', utilsRouter);

// ============================
//  Global Error Handler
// ============================
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ============================
//  MongoDB Connection
// ============================
const connectToMongoDB = async () => {
  try {
    console.log("ENV CHECK:", process.env.MONGO_URI);
     await mongoose.connect(process.env.MONGO_URI);
     
    console.log(" Connected to MongoDB");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1); // Exit if cannot connect
  }
};

// ============================
//  Start Server
// ============================
const PORT = process.env.PORT || 5000;
console.log("Loaded PORT:", process.env.PORT);

//console.log(" Loaded MONGO_URI from .env:", process.env.MONGO_URI);

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
  connectToMongoDB(); // Connect after server is up
});
