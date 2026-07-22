import express from 'express';
import { getFolderById, deleteFolderId, createFolder } from '../controller/folderController.js';

const router = express.Router();
router.post('/create', createFolder);
router.get('/:id', getFolderById);
router.delete('/:id', deleteFolderId);

export { router };
