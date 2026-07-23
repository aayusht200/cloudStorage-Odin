import express from 'express';
import upload from '../config/multer.js';
import { createFile, deleteFileByID, getFileByID } from '../controller/fileController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = new express.Router();

router.post('/create', requireAuth, upload.single('file'), createFile);
router.get('/:id', requireAuth, getFileByID);
router.delete('/:id', requireAuth, deleteFileByID);

export { router };
