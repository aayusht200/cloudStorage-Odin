import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import client from '../config/supabase.config.js';

const uploadFile = async (file) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${crypto.randomUUID()}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);

    const uploadData = await client.send(command);
    if (uploadData.$metadata.httpStatusCode !== 200) {
        throw new Error('File upload failed');
    }

    return {
        key: params.Key,
    };
};

const getSignedUrlByKey = async (key) => {
    const input = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    };
    const getInfo = new GetObjectCommand(input);

    const url = await getSignedUrl(client, getInfo, { expiresIn: 3600 });
    return url;
};

const deleteFile = async (key) => {
    const input = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    };
    const command = new DeleteObjectCommand(input);

    const result = await client.send(command);
    if (result.$metadata.httpStatusCode !== 204) {
        throw new Error('File delete failed');
    }
    return { key };
};

export { deleteFile, getSignedUrlByKey, uploadFile };
