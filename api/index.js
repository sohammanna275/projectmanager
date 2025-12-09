import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// FIX: Changed "..src/" to "../src/"
import { errorHandler } from "../src/middlewares/error.middleware.js"; 
import healthCheckRouter from "../src/routes/healthcheck.routes.js"; 
import authRouter from "../src/routes/auth.routes.js"; 

// FIX: Changed "..src/" to "../src/"
import connectDB from '../src/db/index.js'; 
connectDB(); 

const app = express();

// ** 1. Middleware Configuration **
app.use(express.json({ limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


// ** 2. Route Mounting **
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);

// ** 3. Error Handler **
app.use(errorHandler);

// ** 4. EXPORT for Vercel Serverless Function **
export default app;