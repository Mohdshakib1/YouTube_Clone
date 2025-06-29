
import videofile from "../Models/videofile.js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";
import fs from "fs";

ffmpeg.setFfmpegPath(ffmpegPath);


const resolutions = [320, 480, 720, 1080];
const resolutionsMap = {
  320: { width: 568, height: 320 },
  480: { width: 854, height: 480 },
  720: { width: 1280, height: 720 },
  1080: { width: 1920, height: 1080 },
};


const ensureFolders = () => {
  resolutions.forEach((res) => {
    const dir = `uploads/processed/${res}p`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

export const uploadvideo = async (req, res) => {
  console.log("Received file:", req.file);
  console.log("Received body:", req.body);

  if (!req.file) {
    return res.status(400).json({
      message: "No file received or invalid file type",
      details: {
        receivedFile: req.file,
        expectedType: "video/mp4",
      },
    });
  }

  try {
    ensureFolders();

    const originalPath = req.file.path;
    const baseName = path.parse(originalPath).name;
    const processedPaths = [];

    await Promise.all(
      resolutions.map((res) => {
        const outputPath = `uploads/processed/${res}p/${baseName}_${res}p.mp4`;
        const { width, height } = resolutionsMap[res];

        return new Promise((resolve, reject) => {
          ffmpeg(originalPath)
            .outputOptions([
              `-vf scale=${width}:${height}`,   
              "-c:v libx264",
              "-preset veryfast",
              "-crf 28",
              "-c:a copy"
            ])
            .on("end", () => {
              console.log(`✅ ${res}p done: ${outputPath}`);
              processedPaths.push({
                res: `${res}p`,
                path: outputPath.replace(/\\/g, "/")
              });
              resolve();
            })
            .on("error", (err) => {
              console.error(`❌ FFmpeg error for ${res}p:`, err.message);
              reject(err);
            })
            .save(outputPath);
        });
      })
    );

    const file = new videofile({
      videotitle: req.body.title,
      filename: req.file.originalname,
      filepath: req.file.path.replace(/\\/g, "/"),
      filetype: req.file.mimetype,
      filesize: req.file.size,
      videochanel: req.body.chanel,
      uploader: req.body.uploader,
      resolutions: processedPaths,
    });

    await file.save();
    res.status(200).json({ message: "Upload and processing done ✅", file });

  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all videos
export const getallvideos = async (req, res) => {
  try {
    const files = await videofile.find();
    res.status(200).send(files);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
