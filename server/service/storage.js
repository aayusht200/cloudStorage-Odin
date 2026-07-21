import client from '../config/supabase.config.js';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const uploadFile = async (file) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${crypto.randomUUID()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    try {
        const uploadData = await client.send(command);
        if (uploadData.$metadata.httpStatusCode !== 200) {
            throw new Error('File upload failed');
        }

        return {
            key: params.Key,
        };
    } catch (error) {
        throw error;
    }
};

const getSignedUrlByKey = async (key) => {
    const input = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    };
    const getInfo = new GetObjectCommand(input);
    try {
        const url = await getSignedUrl(client, getInfo, { expiresIn: 3600 });
        return url;
    } catch (error) {
        throw error;
    }
};

const deleteFile = async (key) => {
    const input = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    };
    const command = new DeleteObjectCommand(input);
    try {
        const result = await client.send(command);
        if (result.$metadata.httpStatusCode !== 200) {
            throw new Error('File delete failed');
        }
        return { key };
    } catch (error) {
        throw error;
    }
};

export { uploadFile, getSignedUrlByKey, deleteFile };
