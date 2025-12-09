import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./.env",
});

//let myusername = process.env.username;
//let mydatabase = process.env.database;


const port = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port https://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to the database (MongoDB connection error) ", err);
    });