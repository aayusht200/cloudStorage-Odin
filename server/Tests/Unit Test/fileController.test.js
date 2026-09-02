import { beforeEach, describe, expect, it, vi } from 'vitest';
import prisma from '../../config/Connection.js';
import { createFile, deleteFileByID, getFileByID } from '../../controller/fileController';
import { generatePath } from '../../service/generatePath.js';
import { deleteFile, getSignedUrlByKey, uploadFile } from '../../service/storage.js';
vi.mock('../../config/Connection.js', () => ({
    default: {
        folder: {
            findFirst: vi.fn(),
        },
        file: {
            create: vi.fn(),
            findFirst: vi.fn(),
            deleteMany: vi.fn(),
        },
    },
}));

vi.mock('../../service/storage.js', () => ({
    uploadFile: vi.fn(),
    getSignedUrlByKey: vi.fn(),
    deleteFile: vi.fn(),
}));
vi.mock('../../service/generatePath.js', () => ({
    generatePath: vi.fn(),
}));

describe('createFile', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {
                folderId: crypto.randomUUID(),
            },
            file: undefined,
            user: {
                id: '',
            },
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
        };

        next = vi.fn();
    });

    describe('failure', () => {
        describe('when no file is uploaded', () => {
            it('should return 400', async () => {
                // Arrange

                // Act
                await createFile(req, res, next);

                // Assert
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    message: 'No file uploaded',
                });
                expect(next).not.toHaveBeenCalled();
                expect(uploadFile).not.toHaveBeenCalled();
            });
        });

        describe('when the folder does not belong to the user', () => {
            it('should return 400', async () => {
                // Arrange
                req.file = {
                    id: crypto.randomUUID(),
                };

                vi.mocked(prisma.folder.findFirst).mockResolvedValue(undefined);

                // Act
                await createFile(req, res, next);

                // Assert
                expect(prisma.folder.findFirst).toHaveBeenCalledWith({
                    where: {
                        id: req.body.folderId,
                        userId: req.user.id,
                    },
                });

                expect(uploadFile).not.toHaveBeenCalled();

                expect(res.status).toHaveBeenCalledWith(400);

                expect(res.json).toHaveBeenCalledWith({
                    message: 'Invalid folder Id',
                });

                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('when uploading the file fails', () => {
            it('should pass the error to next', async () => {
                // Arrange
                const error = new Error('Upload failed');
                req.file = {
                    id: crypto.randomUUID(),
                };

                vi.mocked(prisma.folder.findFirst).mockResolvedValue({
                    id: req.body.folderId,
                });

                uploadFile.mockRejectedValue(error);

                // Act
                await createFile(req, res, next);

                // Assert
                expect(prisma.folder.findFirst).toHaveBeenCalledWith({
                    where: {
                        id: req.body.folderId,
                        userId: req.user.id,
                    },
                });

                expect(prisma.file.create).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalledWith(error);
            });
        });

        describe('when creating the database record fails', () => {
            it('should pass the error to next', async () => {
                // Arrange
                const error = new Error('DB error');
                const storageName = crypto.randomUUID();
                req.file = {
                    mimetype: 'image/png',
                    originalname: 'testFileName',
                    size: 1000,
                };

                vi.mocked(prisma.folder.findFirst).mockResolvedValue({
                    id: req.body.folderId,
                });

                vi.mocked(uploadFile).mockResolvedValue({
                    key: storageName,
                });

                prisma.file.create.mockRejectedValue(error);

                // Act
                await createFile(req, res, next);

                // Assert
                expect(prisma.folder.findFirst).toHaveBeenCalledWith({
                    where: {
                        id: req.body.folderId,
                        userId: req.user.id,
                    },
                });

                expect(uploadFile).toHaveBeenCalledWith(req.file);

                expect(prisma.file.create).toHaveBeenCalledWith({
                    data: expect.objectContaining({
                        storageName: expect.any(String),
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
                                id: req.body.folderId,
                            },
                        },
                    }),
                });
                expect(deleteFile).toHaveBeenCalledWith(expect.any(String));
                expect(deleteFile).toHaveBeenCalledWith(storageName);
                expect(next).toHaveBeenCalledWith(error);
            });
        });
    });

    describe('success', () => {
        it('should upload the file and create the database record', async () => {
            // Arrange
            req.file = {
                mimetype: 'image/png',
                originalname: 'testFileName',
                size: 1000,
            };

            vi.mocked(prisma.folder.findFirst).mockResolvedValue({
                id: req.body.folderId,
            });

            vi.mocked(uploadFile).mockResolvedValue({
                key: crypto.randomUUID(),
            });

            prisma.file.create.mockResolvedValue({});

            // Act
            await createFile(req, res, next);

            // Assert
            expect(prisma.folder.findFirst).toHaveBeenCalledWith({
                where: {
                    id: req.body.folderId,
                    userId: req.user.id,
                },
            });

            expect(uploadFile).toHaveBeenCalledWith(req.file);

            expect(prisma.file.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    storageName: expect.any(String),
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
                            id: req.body.folderId,
                        },
                    },
                }),
            });

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'File uploaded sucessfully',
            });
            expect(next).not.toHaveBeenCalled();
        });
    });
});

describe('getFileByID', () => {
    let req;
    let res;
    let next;
    let fileInfo;
    beforeEach(() => {
        req = {
            params: {
                id: crypto.randomUUID(),
            },
            user: {
                id: crypto.randomUUID(),
            },
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
        };

        next = vi.fn();
        fileInfo = {
            id: crypto.randomUUID(),
            originalName: 'fileName',
            fileSize: 1000,
            mimeType: 'image/png',
            updatedAt: new Date(),
            storageName: 'fileName',
        };
    });

    describe('failure', () => {
        describe('when the file does not exist', () => {
            it('should return 404', async () => {
                // Arrange
                prisma.file.findFirst.mockResolvedValue(null);
                // Act
                await getFileByID(req, res, next);
                // Assert
                expect(prisma.file.findFirst).toHaveBeenCalledWith({
                    where: {
                        id: req.params.id,
                        userId: req.user.id,
                    },
                });
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({ message: 'No file found with this id' });
                expect(next).not.toHaveBeenCalled();
                expect(getSignedUrlByKey).not.toHaveBeenCalled();
            });
        });

        describe('when generating the signed URL fails', () => {
            it('should return 500', async () => {
                // Arrange
                prisma.file.findFirst.mockResolvedValue(fileInfo);
                getSignedUrlByKey.mockResolvedValue(null);
                // Act
                await getFileByID(req, res, next);
                // Assert
                expect(prisma.file.findFirst).toHaveBeenCalledWith({
                    where: {
                        id: req.params.id,
                        userId: req.user.id,
                    },
                });
                expect(getSignedUrlByKey).toHaveBeenCalledWith(fileInfo.storageName);
                expect(generatePath).toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Unable to generate file URL',
                });
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('when an error occurs', () => {
            it('should pass the error to next', async () => {
                // Arrange
                const error = new Error('Error occuecred');
                prisma.file.findFirst.mockResolvedValue(fileInfo);
                generatePath.mockRejectedValue(error);
                // Act
                await getFileByID(req, res, next);
                // Assert
                expect(prisma.file.findFirst).toHaveBeenCalledWith({
                    where: {
                        id: req.params.id,
                        userId: req.user.id,
                    },
                });
                expect(getSignedUrlByKey).toHaveBeenCalledWith(fileInfo.storageName);
                expect(generatePath).toHaveBeenCalledWith(fileInfo.folderId);
                expect(res.json).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalledWith(error);
            });
        });
    });

    describe('success', () => {
        it('should return the file information with the signed URL and path', async () => {
            // Arrange
            getSignedUrlByKey.mockResolvedValue('url');
            generatePath.mockResolvedValue('path');
            prisma.file.findFirst.mockResolvedValue(fileInfo);
            // Act
            await getFileByID(req, res, next);
            // Assert
            expect(prisma.file.findFirst).toHaveBeenCalledWith({
                where: {
                    id: req.params.id,
                    userId: req.user.id,
                },
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                id: fileInfo.id,
                name: fileInfo.originalName,
                size: fileInfo.fileSize,
                type: fileInfo.mimeType,
                updatedAt: fileInfo.updatedAt,
                url: 'url',
                path: 'path',
            });
            expect(next).not.toHaveBeenCalled();
        });
    });
});
describe('deleteFileByID', () => {
    let req;
    let res;
    let next;
    let fileInfo;
    beforeEach(() => {
        req = {
            params: {
                id: crypto.randomUUID(),
            },
            user: {
                id: crypto.randomUUID(),
            },
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
        };

        next = vi.fn();
        fileInfo = {
            id: crypto.randomUUID(),
            originalName: 'fileName',
            fileSize: 1000,
            mimeType: 'image/png',
            updatedAt: new Date(),
            storageName: 'fileName',
        };
    });

    describe('failure', () => {
        describe('when the file does not exist', () => {
            it('should return 404', async () => {
                // Arrange
                prisma.file.findFirst.mockResolvedValue(null);
                // Act
                await deleteFileByID(req, res, next);
                // Assert
                expect(prisma.file.findFirst).toHaveBeenCalledWith({
                    where: {
                        id: req.params.id,
                        userId: req.user.id,
                    },
                });
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({ message: 'No file with id found.' });
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('when deleting the file from storage fails', () => {
            it('should pass the error to next', async () => {
                // Arrange
                const error = new Error('Storage failed');
                deleteFile.mockRejectedValue(error);
                prisma.file.findFirst.mockResolvedValue(fileInfo);
                // Act
                await deleteFileByID(req, res, next);
                // Assert
                expect(prisma.file.findFirst).toHaveBeenCalledWith({
                    where: {
                        id: req.params.id,
                        userId: req.user.id,
                    },
                });
                expect(deleteFile).toHaveBeenCalledWith(fileInfo.storageName);
                expect(prisma.file.deleteMany).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalledWith(error);
                expect(res.status).not.toHaveBeenCalled();
                expect(res.json).not.toHaveBeenCalled();
            });
        });

        describe('when the database record is not deleted', () => {
            it('should return 404', async () => {
                // Arrange
                deleteFile.mockResolvedValue(null);
                prisma.file.findFirst.mockResolvedValue(fileInfo);
                prisma.file.deleteMany.mockResolvedValue({ count: 0 });
                // Act
                await deleteFileByID(req, res, next);
                // Assert
                expect(prisma.file.findFirst).toHaveBeenCalledWith({
                    where: {
                        id: req.params.id,
                        userId: req.user.id,
                    },
                });
                expect(deleteFile).toHaveBeenCalledWith(fileInfo.storageName);
                expect(prisma.file.deleteMany).toHaveBeenCalledWith({
                    where: { id: req.params.id, userId: req.user.id },
                });
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({ message: 'File with id not found.' });
            });
        });

        describe('when an error occurs', () => {
            it('should pass the error to next', async () => {
                // Arrange
                const error = new Error('DB Error');
                deleteFile.mockResolvedValue(null);
                prisma.file.findFirst.mockResolvedValue(fileInfo);
                prisma.file.deleteMany.mockRejectedValue(error);
                // Act
                await deleteFileByID(req, res, next);
                // Assert
                expect(prisma.file.findFirst).toHaveBeenCalledWith({
                    where: {
                        id: req.params.id,
                        userId: req.user.id,
                    },
                });
                expect(deleteFile).toHaveBeenCalledWith(fileInfo.storageName);
                expect(prisma.file.deleteMany).toHaveBeenCalledWith({
                    where: { id: req.params.id, userId: req.user.id },
                });
                expect(next).toHaveBeenCalledWith(error);
                expect(res.status).not.toHaveBeenCalled();
                expect(res.json).not.toHaveBeenCalled();
            });
        });
    });

    describe('success', () => {
        it('should delete the file from storage and database', async () => {
            // Arrange
            const id = req.params.id;
            prisma.file.findFirst.mockResolvedValue(fileInfo);
            deleteFile.mockResolvedValue('test');
            prisma.file.deleteMany.mockResolvedValue({ count: 1 });
            // Act
            await deleteFileByID(req, res, next);
            // Assert
            expect(prisma.file.findFirst).toHaveBeenCalledWith({
                where: {
                    id: req.params.id,
                    userId: req.user.id,
                },
            });
            expect(deleteFile).toHaveBeenCalledWith(fileInfo.storageName);
            expect(prisma.file.deleteMany).toHaveBeenCalledWith({
                where: { id: req.params.id, userId: req.user.id },
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'File deleted sucessfully', id });
            expect(next).not.toHaveBeenCalled();
        });
    });
});
