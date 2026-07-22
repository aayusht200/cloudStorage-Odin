import prisma from '../config/Connection.js';
const createFolder = async (req, res, next) => {
    const { folderName, parentId } = req.body;
    try {
        const result = await prisma.folder.create({
            data: {
                folderName,
                parentId,
                userId: req.user.id,
            },
        });
        return res.status(201).json({ message: 'Folder created successfully', id: result.id });
    } catch (error) {
        next(error);
    }
};

const getFolderById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await prisma.folder.findFirst({
            where: { id, userId: req.user.id },
            include: {
                files: {
                    select: {
                        id: true,
                        storageName: true,
                        originalName: true,
                        mimeType: true,
                        fileSize: true,
                    },
                },
                children: {
                    select: {
                        id: true,
                        folderName: true,
                    },
                },
            },
        });
        if (!result) {
            return res.status(404).json({ message: 'Folder with id not found' });
        }
        res.status(200).json({
            id: result.id,
            folderName: result.folderName,
            createdAt: result.createdAt,
            files: result.files,
            parentId: result.parentId,
            children: result.children,
        });
    } catch (error) {
        next(error);
    }
};

const deleteFolderId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await prisma.folder.deleteMany({ where: { id, userId: req.user.id } });
        if (result.count === 0) return res.status(404).json({ message: 'Folder with id not found' });
        res.status(200).json({ message: 'Folder delete successfully' });
    } catch (error) {
        next(error);
    }
};

export { getFolderById, deleteFolderId, createFolder };
