import cors from 'cors';
import session from 'express-session';
import express from 'express';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import connectPgSimple from 'connect-pg-simple';
import pool from './prisma/Pool.js';
import client from './config/supabase.config.js';
import { test } from './test.js';

const pgStore = new connectPgSimple(session);
const app = express();
test();
app.use(
    session({
        store: new pgStore({ pool, createTableIfMissing: true }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        },
    })
);
app.use(cors({ origin: process.env.ORIGIN, credentials: true })); //cors setup

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
    res.send('hello world');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

app.use((req, res) => {
    res.status(404).send({ message: 'Invalid route' });
});

export { app };
