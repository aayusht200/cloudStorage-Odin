import client from '../config/supabase.config.js';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

// const params = {
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: req.file.originalname,
//     Body: req.file.buffer,
//     ContentType: req.file.mimetype,
// };

function uploadFile(req, res, next) {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params);
    client
        .send(command)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
    res.send({ message: 'test' });
}

export default uploadFile;
