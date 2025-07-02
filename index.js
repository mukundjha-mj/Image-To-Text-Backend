import Tesseract from 'tesseract.js';
import fs from 'fs';

// const express = require("express");
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: "http://localhost:5173", // Allow requests from your React app
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
const PORT = 3000

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
    res.json({
        message: "hii",
    });
});

app.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    console.log('File uploaded:', req.file.filename);
    
    const imagePath = req.file.path;
    const outputFile = `extracted-text-${Date.now()}.txt`;

    try {
        console.log('Starting OCR processing...');
        const result = await Tesseract.recognize(imagePath);
        const extractedText = result.data.text;

        // Save to text file
        fs.writeFileSync(outputFile, extractedText, 'utf8');

        console.log('Extracted text:');
        console.log(extractedText);
        console.log(`Text has been saved to: ${outputFile}`);

        res.json({
            message: "File uploaded and text extracted successfully!",
            filename: req.file.filename,
            extractedText: extractedText,
            textFile: outputFile
        });

    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ 
            error: "Failed to extract text from image",
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

