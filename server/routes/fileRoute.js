import express from 'express';
import upload from '../config/multer.js';
import { createFile, deleteFileByID, getFileByID } from '../controller/fileController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createFileSchema, idSchema } from '../schema/file.js';
const router = new express.Router();

router.post('/create', requireAuth, upload.single('file'), validate(createFileSchema, 'file'), createFile);
router.get('/:id', requireAuth, validate(idSchema, 'params'), getFileByID);
router.delete('/:id', requireAuth, validate(idSchema, 'params'), deleteFileByID);

export { router };
