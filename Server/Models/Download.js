import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "videofile", required: true },
  resolution: { type: String },
  title: { type: String },
  path: { type: String },
}, { timestamps: true }); // ✅ enables createdAt and updatedAt automatically

export default mongoose.model("Download", downloadSchema);
