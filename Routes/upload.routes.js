import Router from "express";
import multer from "multer";
import path from "path";
import { userModel } from "../DB/db.js";
import { userMiddleware } from "../middleware/user.js";


const uploadRouter = Router();



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

uploadRouter.use(userMiddleware)

uploadRouter.get('/user', async (req, res)=>{
    const user = await userModel.findById(req.userId);

    if(!user){
        res.status(403).json({
            message: "User not Found"
        })
    }

    res.json({
        firstName: user
    })
})

uploadRouter.post("/upload", upload.single("image"), async (req, res) => {
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

export {uploadRouter}

