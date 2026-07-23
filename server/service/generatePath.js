import prisma from '../config/Connection.js';
export const generatePath = async (id) => {
    const path = [];
    let current = await prisma.folder.findUnique({ where: { id } });
    while (current) {
        path.push({ name: current.folderName, id: current.id });
        if (!current.parentId) break;
        current = await prisma.folder.findUnique({ where: { id: current.parentId } });
    }
    return path.reverse();
};
