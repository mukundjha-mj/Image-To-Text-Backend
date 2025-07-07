import Tesseract from 'tesseract.js';
import fs from 'fs';

// const express = require("express");
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userRouter } from './Routes/user.routes.js';
import { uploadRouter } from './Routes/upload.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000

// Enable CORS for all routes
app.use(cors({
    origin: "http://localhost:5173", // Allow requests from your React app
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use('/api/v1/user', userRouter)
app.use('/api/v1/upload', uploadRouter)

app.get("/", (req, res) => {
    res.json({
        message: "hii",
    });
});



async function main() {
    await mongoose.connect(process.env.DATABASE_URL)

    app.listen(PORT, () => {
        console.log("server is running on http://localhost:3000");
    })
}

main()
