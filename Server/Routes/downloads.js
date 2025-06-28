import express from 'express';
import { addDownload, getUserDownloads } from '../Controllers/downloadController.js';


const router = express.Router();

router.post('/add', addDownload);
router.get('/user/:id', getUserDownloads);

export default router;
