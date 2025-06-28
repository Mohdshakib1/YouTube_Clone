import Download from "../Models/Download.js";
import User from "../Models/Auth.js";
import Video from "../Models/videofile.js";

export const addDownload = async (req, res) => {
  const { userId, videoId, resolution } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ success: false, message: "Video not found" });

   const now = new Date();
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const downloadsToday = await Download.find({
  userId,
  createdAt: { $gte: startOfDay }
});

    const isPremium = user.isPremium && (!user.premiumExpiresAt || new Date(user.premiumExpiresAt) > new Date());

    // ✅ BLOCK second download attempt (any video) for free users
    if (!isPremium) {
      const downloadsToday = await Download.find({
        userId,
        createdAt: { $gte: startOfDay }
      });

      if (downloadsToday.length >= 1) {
        return res.status(403).json({
          success: false,
          limitReached: true,
          message: "Free user download limit reached"
        });
      }
    }

    let path = video.filepath;
    if (resolution && video.resolutions?.length > 0) {
      const resObj = video.resolutions.find((r) => r.res === resolution);
      if (resObj) path = resObj.path;
    }

    const newDownload = new Download({
      userId,
      videoId,
      resolution: resolution || "original",
      title: video.videotitle || "Untitled",
      path,
      createdAt: new Date()
    });

    await newDownload.save();

    res.status(201).json({
      success: true,
      message: "Download successful",
      isPremium
    });
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// ✅ Get all user downloads (with populated video info if needed)
export const getUserDownloads = async (req, res) => {
  try {
    const downloads = await Download.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(downloads);
  } catch (err) {
    console.error("Fetch downloads error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch downloads" });
  }
};