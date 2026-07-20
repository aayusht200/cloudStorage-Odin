import client from '../config/supabase.config.js';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

async function uploadFile(req, res, next) {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    };
    const input = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: req.file.originalname,
    };
    const command = new PutObjectCommand(params);
    try {
        const uploadData = await client.send(command);
        if (uploadData.$metadata.httpStatusCode === 200) {
            const getInfo = new GetObjectCommand(input);
            const url = await getSignedUrl(client, getInfo, { expiresIn: 3600 });
            return res.status(200).send(JSON.stringify(url));
        }
    } catch (error) {
        console.log(error);
        return res.status(404).send({ message: 'Error' });
    }
}

export default uploadFile;
