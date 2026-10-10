import dotenv from "dotenv";
import connectDB from "./config/database.js";
import app from "./app.js";

// Load environment variables from .env file
dotenv.config({
    path: './.env'
});

//server
const startServer = async () => {
    try {
        await connectDB();

        // Handle uncaught exceptions
        app.on("error", (error) => {
            console.error("ERROR", error);
        });

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
};

startServer();