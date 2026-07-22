import { uploadFile, getSignedUrlByKey, deleteFile } from '../service/storage.js';
import prisma from '../config/Connection.js';
const createFile = async (req, res, next) => {
    const { folderId } = req.body;
    if (!req.file) {
        return res.status(400).json({
            message: 'No file uploaded',
        });
    }
    try {
        const validFolder = await prisma.folder.findFirst({ where: { id: folderId, userId: req.user.id } });
        if (!validFolder) {
            return res.status(400).json({
                message: 'Invalid folder Id',
            });
        }
        const { key: storageName } = await uploadFile(req.file);
        const result = await prisma.file.create({
            data: {
                storageName,
                mimeType: req.file.mimetype,
                originalName: req.file.originalname,
                fileSize: req.file.size,
                uploadedBy: {
                    connect: {
                        id: req.user.id,
                    },
                },
                folder: {
                    connect: {
                        id: folderId,
                    },
                },
            },
        });
        return res.status(201).send({
            message: 'File uploaded sucessfully',
        });
    } catch (error) {
        next(error);
    }
};
const getFileByID = async (req, res, next) => {
    const { id } = req.params;
    try {
        const fileInfo = await prisma.file.findFirst({ where: { id, userId: req.user.id } });
        if (!fileInfo) {
            return res.status(404).json({
                message: 'No file found with this id',
            });
        }
        const url = await getSignedUrlByKey(fileInfo.storageName);
        if (url) {
            return res.status(200).json({
                id: fileInfo.id,
                name: fileInfo.originalName,
                size: fileInfo.fileSize,
                type: fileInfo.mimeType,
                updatedAt: fileInfo.updatedAt,
                url: url,
            });
        }
        return res.status(500).json({
            message: 'Unable to generate file URL',
        });
    } catch (error) {
        next(error);
    }
};
const deleteFileByID = async (req, res, next) => {
    const { id } = req.params;
    try {
        const fileInfo = await prisma.file.findFirst({ where: { id, userId: req.user.id } });
        if (!fileInfo) return res.status(404).json({ message: 'No file with id found.' });
        await deleteFile(fileInfo.storageName);
        const deleteSuccess = await prisma.file.deleteMany({ where: { id, userId: req.user.id } });
        if (deleteSuccess.count === 0) return res.status(404).json({ message: 'File with id not found.' });
        return res.status(200).send({ message: 'File deleted sucessfully', id });
    } catch (error) {
        next(error);
    }
};

export { getFileByID, deleteFileByID, createFile };
