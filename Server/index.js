import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from 'path';
import fs from "fs";
import { fileURLToPath } from 'url';

import videoroutes from './Routes/video.js';
import userroutes from "./Routes/User.js";
import commentroutes from './Routes/comment.js';
import downloadRoutes from './Routes/downloads.js';
import paymentRoutes from "./Routes/payment.js";
import verifyRoutes from "./Routes/verify.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// ✅ Ensure uploads folders exist
const uploadFolders = [
  "uploads",
  "uploads/processed",
  "uploads/processed/320p",
  "uploads/processed/480p",
  "uploads/processed/720p",
  "uploads/processed/1080p"
];
uploadFolders.forEach(folder => {
  const fullPath = path.join(__dirname, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created missing folder: ${fullPath}`);
  }
});

const allowedOrigins = [
  'https://md-youtube-clone.netlify.app',
  'http://localhost:3000' // for local testing
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/videos', express.static(
  path.join(__dirname, 'uploads', 'processed'),
  {
    setHeaders: (res) => {
      res.set('Content-Disposition', 'attachment');
    }
  }
));

// Routes
app.get('/', (req, res) => res.send("Your tube is working"));
app.use('/user', userroutes);
app.use('/video', videoroutes);
app.use('/comment', commentroutes);
app.use('/api/downloads', downloadRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payment", verifyRoutes);

// Connect DB
const DB_URL = process.env.DB_URL;
mongoose.connect(DB_URL)
  .then(() => {
    console.log("Mongodb Database connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection failed:", error);
  });