import express from "express";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Create an S3 client without explicitly providing credentials
const s3Client = new S3Client({
  region: process.env.AWS_REGION, // e.g., 'us-east-1'
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to SnapShare API.");
})

app.post("/upload", upload.single("photo"), async (req, res) => {
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME, // Your S3 bucket name from .env
    Key: `photos/${Date.now()}_${req.file.originalname}`, // Unique key for the file
    Body: req.file.buffer, // The file content
    ContentType: req.file.mimetype, // The MIME type of the file
  };

  try {
    const command = new PutObjectCommand(s3Params);
    await s3Client.send(command);
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${s3Params.Key}`;
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error("Error uploading to S3:", error); // Log the error
    res.status(500).json({ error: "Error processing photo" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
