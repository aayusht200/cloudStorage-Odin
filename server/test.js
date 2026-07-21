import { ListBucketsCommand } from '@aws-sdk/client-s3';
import client from './config/supabase.config.js';
import prisma from './prisma/Connection.js';
import bcrypt from 'bcrypt';

const email = 'test@gmail.com';
const password = '$2b$10$bwmcsin.6fT7JfCeDuZlE.qBC40.VShN1b7/tHpWbOXaDo.Wrwlbq';
const fName = 'aayush';
const lName = 'trivedi';
const role = 'admin';

export const test = async () => {
    // prisma.user.create({ data: { email: email, password: password, firstName: fName, lastName: lName, role: role } });
    // const email = 'test@gmail.com';
    try {
        // const result = await prisma.user.create({
        //     data: { email: email, password: password, firstName: fName, lastName: lName, role: 'ADMIN' },
        // });
        // const result = await bcrypt.hashSync('test123', 10);
        const result = await prisma.user.findUnique({ where: { email: email } });
        console.log(result);
        return;
    } catch (error) {
        console.log(error);
    }

    // const command = new ListBucketsCommand({});
    // client
    //     .send(command)
    //     .then((res) => {
    //         console.log(res);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
};
test();
