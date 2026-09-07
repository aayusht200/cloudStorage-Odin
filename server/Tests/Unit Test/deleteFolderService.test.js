import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import prisma from '../../config/Connection.js';
import { deleteFolder } from '../../service/deleteFolder';
import { deleteFileList } from '../../service/storage';
vi.mock('../../config/Connection.js', () => ({
    default: {
        folder: {
            delete: vi.fn(),
            findMany: vi.fn(),
        },
    },
}));

vi.mock('../../service/storage.js', () => ({
    deleteFileList: vi.fn(),
}));

describe('deleteFolder', () => {
    let userId;
    let folderID;
    let mockFolderOne;
    let fileOne;
    beforeEach(() => {
        vi.clearAllMocks();
        userId = crypto.randomUUID();
        folderID = crypto.randomUUID();
        fileOne = { storageName: 'file-one' };
        mockFolderOne = {
            id: folderID,
            parentId: null,
            files: [fileOne],
        };
    });
    describe('success', () => {
        it('should return true when the folder and its files are deleted', async () => {
            // Arrange
            vi.mocked(prisma.folder.findMany).mockResolvedValue([mockFolderOne]);
            vi.mocked(prisma.folder.delete).mockResolvedValue();
            vi.mocked(deleteFileList).mockResolvedValue();
            // Act
            const result = await deleteFolder({ userID: userId, folderId: folderID });
            // Assert
            expect(result).toBe(true);

            expect(prisma.folder.findMany).toHaveBeenCalledWith({
                where: {
                    userId,
                },
                select: {
                    id: true,
                    parentId: true,
                    files: {
                        select: {
                            storageName: true,
                        },
                    },
                },
            });

            expect(prisma.folder.delete).toHaveBeenCalledWith({
                where: {
                    id: folderID,
                    userId,
                },
            });

            expect(deleteFileList).toHaveBeenCalledWith(['file-one']);
        });
    });

    describe('failure', () => {
        it('should return false when the folder does not exist', async () => {
            // Arrange
            const error = new Prisma.PrismaClientKnownRequestError('Folder not found', {
                code: 'P2025',
                clientVersion: '7.10.0',
            });
            vi.mocked(prisma.folder.findMany).mockResolvedValue([mockFolderOne]);
            vi.mocked(prisma.folder.delete).mockRejectedValue(error);
            // Act
            const result = await deleteFolder({ userID: userId, folderId: folderID });
            // Assert
            expect(prisma.folder.findMany).toHaveBeenCalledWith({
                where: {
                    userId: userId,
                },
                select: {
                    id: true,
                    parentId: true,
                    files: {
                        select: {
                            storageName: true,
                        },
                    },
                },
            });
            expect(prisma.folder.delete).toHaveBeenCalledWith({
                where: {
                    id: folderID,
                    userId: userId,
                },
            });
            expect(result).toBe(false);
        });

        it('should throw when folder deletion fails', async () => {
            // Arrange
            const error = new Error('Folder deletion failed');

            vi.mocked(prisma.folder.findMany).mockResolvedValue([mockFolderOne]);
            vi.mocked(prisma.folder.delete).mockRejectedValue(error);

            // Act & Assert
            await expect(
                deleteFolder({
                    userID: userId,
                    folderId: folderID,
                })
            ).rejects.toThrow(error);

            expect(prisma.folder.findMany).toHaveBeenCalledWith({
                where: {
                    userId,
                },
                select: {
                    id: true,
                    parentId: true,
                    files: {
                        select: {
                            storageName: true,
                        },
                    },
                },
            });

            expect(prisma.folder.delete).toHaveBeenCalledWith({
                where: {
                    id: folderID,
                    userId,
                },
            });
        });

        it('should throw when storage deletion fails', async () => {
            // Arrange
            const error = new Error('Folder deletion failed');

            vi.mocked(prisma.folder.findMany).mockResolvedValue([mockFolderOne]);
            vi.mocked(prisma.folder.delete).mockResolvedValue();
            vi.mocked(deleteFileList).mockRejectedValue(error);

            // Act
            await expect(
                deleteFolder({
                    userID: userId,
                    folderId: folderID,
                })
            ).rejects.toThrow(error);

            // Assert
            expect(deleteFileList).toHaveBeenCalledWith(['file-one']);
        });
    });
});
