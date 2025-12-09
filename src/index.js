import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

// Keep dotenv config, as it might be needed for local development or utility scripts
dotenv.config({
    path: "./.env",
});

// Remove the port definition: const port = process.env.PORT || 3000;

// Call connectDB, but remove the entire .then() block
// The DB connection will now be handled by the call in api/index.js
connectDB()
    .catch((err) => {
        console.error("Failed to connect to the database (MongoDB connection error) ", err);
    });

// Ensure you don't use 'app' or 'port' anywhere else in this file.