import express from 'express';
import { getFileByID, deleteFileByID, createFile } from '../controller/fileController.js';
import upload from '../config/multer.js';
const router = new express.Router();

router.post('/create', upload.single('file'), createFile);
router.get('/:id', getFileByID);
router.delete('/:id', deleteFileByID);

export { router };
