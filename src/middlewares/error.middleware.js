// src/middlewares/error.middleware.js

import { ApiError } from "../utils/api-error.js"; // Import the custom error class

/**
 * Global Error Handler Middleware
 * Note: The signature (err, req, res, next) is critical for Express to recognize it as an error handler.
 */
const errorHandler = (err, req, res, next) => {
    // 1. Determine base status code, message, and errors from the thrown object
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || []; // Extract the validation errors array

    // 2. Handle specific database errors (like Mongoose duplicate key error 11000)
    // This is optional but highly recommended for production-ready code.
    if (err.code === 11000) {
        statusCode = 409; // Conflict
        // Attempt to extract the duplicate key value from the error message
        const match = err.message.match(/(["'])(\\?.)*?\1/);
        const value = match ? match[0] : "a duplicate field";
        
        message = `Duplicate resource detected: ${value} already exists.`;
        errors = [];
    }

    // You can add more checks here (e.g., Mongoose Validation Errors 400, JWT errors 401)
    // if they are not already handled by ApiError or your asyncHandler.

    // 3. Send the final, structured JSON error response
    // We construct the JSON manually here instead of using ApiResponse, because
    // ApiResponse does not have a property for 'errors'.
    return res
        .status(statusCode)
        .json({
            statusCode: statusCode,
            data: null, // Data is null for all error responses
            message: message,
            success: false,
            errors: errors // 🎯 THIS IS THE FIX: Explicitly including the errors array
        });
};

export { errorHandler };