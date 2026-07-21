import multer from 'multer';

const MAX_FILE_SIZE = 10 * 1024 * 1024; //10 MB

const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'application/pdf', 'audio/mpeg', 'video/mp4', 'text/plain']);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter(req, file, cb) {
        if (!ALLOWED_TYPES.has(file.mimetype)) {
            return cb(new Error('Invalid file type'));
        }

        cb(null, true);
    },
});

export default upload;
