import { ListBucketsCommand } from '@aws-sdk/client-s3';
import client from './config/supabase.config.js';
export const test = () => {
    const command = new ListBucketsCommand({});
    client
        .send(command)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
};
