import { beforeEach, describe, expect, it, vi } from 'vitest';
import prisma from '../config/Connection.js';
import { createFolder, deleteFolderId, getFolderById } from '../controller/folderController';
import { generatePath } from '../service/generatePath';

vi.mock('../config/Connection.js', () => ({
    default: {
        folder: {
            create: vi.fn(),
            findFirst: vi.fn(),
            deleteMany: vi.fn(),
        },
    },
}));

vi.mock('../service/generatePath.js', () => ({
    generatePath: vi.fn(),
}));

describe('folderController', () => {
    let req;
    let res;
    let next;
    let result;
    beforeEach(() => {
        req = {
            body: {
                folderName: 'Test Folder',
                parentId: crypto.randomUUID(),
            },
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
        };

        next = vi.fn();
        result = {
            id: crypto.randomUUID(),
            folderName: `folderName`,
            createdAt: new Date(),
            files: [],
            parentId: crypto.randomUUID(),
            children: [],
            path: `path`,
        };
    });

    describe('createFolder', () => {
        describe('failure', () => {
            describe('when a folder with the same name exists', () => {
                it('should return 409', async () => {
                    // Arrange
                    const error = new Error('Unique constraint failed');
                    error.code = 'P2002';
                    prisma.folder.create.mockRejectedValue(error);
                    // Act
                    await createFolder(req, res, next);
                    // Assert
                    expect(prisma.folder.create).toHaveBeenCalledWith({
                        data: {
                            folderName: req.body.folderName,
                            parentId: req.body.parentId,
                            userId: req.user.id,
                        },
                    });
                    expect(res.status).toHaveBeenCalledWith(409);
                    expect(res.json).toHaveBeenCalledWith({ message: 'Folder with same name exists' });
                    expect(next).not.toHaveBeenCalled();
                });
            });

            describe('when creating the folder fails', () => {
                it('should pass the error to next', async () => {
                    const error = new Error('Folder creation failed');
                    prisma.folder.create.mockRejectedValue(error);
                    // Act
                    await createFolder(req, res, next);
                    // Assert
                    expect(prisma.folder.create).toHaveBeenCalledWith({
                        data: {
                            folderName: req.body.folderName,
                            parentId: req.body.parentId,
                            userId: req.user.id,
                        },
                    });
                    expect(res.status).not.toHaveBeenCalled();
                    expect(res.json).not.toHaveBeenCalled();
                    expect(next).toHaveBeenCalledWith(error);
                });
            });
        });

        describe('success', () => {
            it('should create the folder and return 201', async () => {
                prisma.folder.create.mockResolvedValue({ id: result.id });
                // Act
                await createFolder(req, res, next);
                // Assert
                expect(prisma.folder.create).toHaveBeenCalledWith({
                    data: {
                        folderName: req.body.folderName,
                        parentId: req.body.parentId,
                        userId: req.user.id,
                    },
                });
                expect(res.status).toHaveBeenCalledWith(201);
                expect(res.json).toHaveBeenCalledWith({ message: 'Folder created successfully', id: result.id });
                expect(next).not.toHaveBeenCalled();
            });
        });
    });

    describe('getFolderById', () => {
        describe('failure', () => {
            describe('when the folder does not exist', () => {
                it('should return 404', async () => {
                    // Arrange
                    prisma.folder.findFirst.mockResolvedValue(null);

                    // Act
                    await getFolderById(req, res, next);

                    // Assert
                    expect(prisma.folder.findFirst).toHaveBeenCalled();
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({
                        message: 'Folder with id not found',
                    });
                    expect(next).not.toHaveBeenCalled();
                });
            });
            describe('when finding the folder fails', () => {
                it('should pass the error to next', async () => {
                    // Arrange
                    const error = new Error('DB error');
                    prisma.folder.findFirst.mockRejectedValue(error);

                    // Act
                    await getFolderById(req, res, next);

                    // Assert
                    expect(next).toHaveBeenCalledWith(error);
                });
            });
            describe('when generating the folder path fails', () => {
                it('should pass the error to next', async () => {
                    // Arrange
                    const id = crypto.randomUUID();
                    const error = new Error('Path generation failed');
                    prisma.folder.findFirst.mockResolvedValue({ id: result.id });
                    generatePath.mockRejectedValue(error);
                    // Act
                    await getFolderById(req, res, next);
                    // Assert
                    expect(prisma.folder.findFirst).toHaveBeenCalled();
                    expect(generatePath).toHaveBeenCalledWith(result.id);
                    expect(res.status).not.toHaveBeenCalled();
                    expect(res.json).not.toHaveBeenCalled();
                    expect(next).toHaveBeenCalledWith(error);
                });
            });
        });

        describe('success', () => {
            it('should return the folder with its files, children, and path', async () => {
                // Arrange
                prisma.folder.findFirst.mockResolvedValue(result);
                generatePath.mockResolvedValue('path');
                // Act
                await getFolderById(req, res, next);
                // Assert
                expect(prisma.folder.findFirst).toHaveBeenCalled();
                expect(generatePath).toHaveBeenCalledWith(result.id);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(result);
            });
        });
    });

    describe('deleteFolderId', () => {
        describe('failure', () => {
            describe('when the folder does not exist', () => {
                it('should return 404', async () => {
                    // Arrange
                    prisma.folder.deleteMany.mockResolvedValue({ count: 0 });
                    // Act
                    await deleteFolderId(req, res, next);
                    // Assert
                    expect(prisma.folder.deleteMany).toHaveBeenCalledWith({
                        where: { id: req.params.id, userId: req.user.id },
                    });
                    expect(res.status).toHaveBeenCalledWith(404);
                    expect(res.json).toHaveBeenCalledWith({ message: 'Folder with id not found' });
                    expect(next).not.toHaveBeenCalled();
                });
            });

            describe('when deleting the folder fails', () => {
                it('should pass the error to next', async () => {
                    // Arrange
                    const error = new Error('Folder delete failed');
                    prisma.folder.deleteMany.mockRejectedValue(error);
                    // Act
                    await deleteFolderId(req, res, next);
                    // Assert
                    expect(prisma.folder.deleteMany).toHaveBeenCalledWith({
                        where: { id: req.params.id, userId: req.user.id },
                    });
                    expect(res.status).not.toHaveBeenCalled();
                    expect(res.json).not.toHaveBeenCalled();
                    expect(next).toHaveBeenCalledWith(error);
                });
            });
        });

        describe('success', () => {
            it('should delete the folder and return 200', async () => {
                // Arrange
                prisma.folder.deleteMany.mockResolvedValue({});
                // Act
                await deleteFolderId(req, res, next);
                // Assert
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({ message: 'Folder delete successfully' });
                expect(next).not.toHaveBeenCalled();
            });
        });
    });
});
