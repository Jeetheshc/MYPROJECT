
import express from "express";
import { connectDB } from "./config/db.js"; // MongoDB connection file
import { apiRouter } from './routes/index.js';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from 'cors' ;
dotenv.config();

const app = express();
const port = 3001;

// Connect to MongoDB
connectDB();

// Middleware1
app.use(express.json());
app.use(
    cors({
        
        origin: ["http://localhost:5173"] ,
        credentials: true,
        methods: ["GET","POST","PATCH","PUT","DELETE"]
    })
);
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Car rent App Home page");
});
// Main API Route
app.use('/api', apiRouter);

// Catch-All Route for Undefined Endpoints
app.all("*", (req, res) => {
    res.status(404).json({ message: "Endpoint does not exist" });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
if (!process.env.JWT_SECRET) {
    console.error("Error: JWT_SECRET is not set");
    process.exit(1); // Exit the process if JWT_SECRET is missing
  }
