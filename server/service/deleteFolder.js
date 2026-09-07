import { Prisma } from '@prisma/client';
import prisma from '../config/Connection.js';
import { deleteFileList } from './storage.js';

export const deleteFolder = async ({ userID, folderId }) => {
    const fileList = await getFolderDetails({ userID, folderId });

    try {
        await prisma.folder.delete({
            where: {
                id: folderId,
                userId: userID,
            },
        });
    } catch (error) {
        // handle P2025 specifically
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return false;
        }

        throw error;
    }

    await deleteFileList(fileList);

    return true;
};
const getFolderDetails = async ({ userID, folderId }) => {
    try {
        const folders = await prisma.folder.findMany({
            where: {
                userId: userID,
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

        // Maps folder ID → folder details
        const folderMap = new Map(folders.map((folder) => [folder.id, folder]));

        // Maps parent folder ID → child folder IDs
        const childrenMap = new Map();

        for (const folder of folders) {
            if (!folder.parentId) continue;

            if (!childrenMap.has(folder.parentId)) {
                childrenMap.set(folder.parentId, []);
            }

            childrenMap.get(folder.parentId).push(folder.id);
        }
        const fileList = [];

        const dfs = (currentFolderId) => {
            const currentFolder = folderMap.get(currentFolderId);

            if (!currentFolder) return;

            fileList.push(...currentFolder.files.map((file) => file.storageName));

            const children = childrenMap.get(currentFolderId) ?? [];

            for (const childId of children) {
                dfs(childId);
            }
        };

        dfs(folderId);

        return fileList;
    } catch (error) {
        throw error;
    }
};
