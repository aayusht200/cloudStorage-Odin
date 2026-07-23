import express from 'express';
import { createFolder, deleteFolderId, getFolderById } from '../controller/folderController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/create', requireAuth, createFolder);
router.get('/:id', requireAuth, getFolderById);
router.delete('/:id', requireAuth, deleteFolderId);

export { router };
