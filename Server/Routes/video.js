import express from "express";
import { likevideocontroller } from "../Controllers/like.js";
import { viewscontroller } from "../Controllers/views.js";
import { uploadvideo, getallvideos } from "../Controllers/video.js";
import { historycontroller, deletehistory, getallhistorycontroller } from "../Controllers/History.js";
import { watchlatercontroller, getallwatchlatervontroller, deletewatchlater } from "../Controllers/watchlater.js";
import { likedvideocontroller, getalllikedvideo, deletelikedvideo } from "../Controllers/likedvideo.js";
import upload from "../Helper/filehelper.js"; // multer config
import auth from "../middleware/auth.js";

const routes = express.Router();

routes.post("/uploadvideo", upload.single("file"), uploadvideo);

// ✅ Get all uploaded videos
routes.get("/getvideos", getallvideos);

// ✅ Like & Views
routes.patch('/like/:id', likevideocontroller);
routes.patch('/view/:id', viewscontroller);

// ✅ Video History
routes.post('/history', historycontroller);
routes.get('/getallhistory', getallhistorycontroller);
routes.delete('/deletehistory/:userid', deletehistory);

// ✅ Watch Later
routes.post('/watchlater', watchlatercontroller);
routes.get('/getallwatchlater', getallwatchlatervontroller);
routes.delete('/deletewatchlater/:videoid/:viewer', deletewatchlater);

// ✅ Liked Videos
routes.post('/likevideo', likedvideocontroller);
routes.get('/getalllikevide', getalllikedvideo);
routes.delete('/deletelikevideo/:videoid/:viewer', deletelikedvideo);

export default routes;
