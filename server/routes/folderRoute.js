import express from 'express';
import { createFolder, deleteFolderId, getFolderById } from '../controller/folderController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { csrfVerification } from '../middleware/csrfMiddleware.js';
import { validate } from '../middleware/validate.js';
import { idSchema } from '../schema/file.js';
import { createFolderSchema } from '../schema/folder.js';
const router = express.Router();
router.post('/create', requireAuth, csrfVerification, validate(createFolderSchema), createFolder);
router.get('/:id', requireAuth, validate(idSchema, 'params'), getFolderById);
router.delete('/:id', requireAuth, csrfVerification, validate(idSchema, 'params'), deleteFolderId);

export { router };
