// api/auth.js
// This file acts as the entry point for Vercel's serverless function

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from '../src/routes/auth.routes.js'; // Adjust path as needed
import healthcheckRouter from '../src/routes/healthcheck.routes.js'; // Adjust path as needed

// 1. Create the Express App
const app = express();

// 2. Configure Middleware for the API
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*", // Use production frontend URL here
    credentials: true,
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// 3. Define API Routes
// Note: We mount the API routes under /api/v1/auth
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);

// 4. Connect DB ONLY when handling the request (Serverless context)
// For Vercel, it's often better to connect the DB inside the handler, 
// but since your connection is global, we will rely on Vercel's caching.
// Ensure your app handles the DB connection gracefully.

// 5. Export the app as the handler
// Vercel expects the exported item to be the function handler
export default app;