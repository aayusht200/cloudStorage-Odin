import express from 'express';
import { createFolder, deleteFolderId, getFolderById } from '../controller/folderController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { idSchema } from '../schema/file.js';
import { createFolderSchema } from '../schema/folder.js';
const router = express.Router();
router.post('/create', requireAuth, validate(createFolderSchema), createFolder);
router.get('/:id', requireAuth, validate(idSchema, 'params'), getFolderById);
router.delete('/:id', requireAuth, validate(idSchema, 'params'), deleteFolderId);

export { router };
