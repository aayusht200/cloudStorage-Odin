import connectPgSimple from 'connect-pg-simple';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from './config/passport.js';
import pool from './config/Pool.js';
import { router as fileRoutes } from './routes/fileRoute.js';
import { router as folderRoutes } from './routes/folderRoute.js';
import { router as userRoutes } from './routes/userRouter.js';
const ONE_DAY = 24 * 60 * 60 * 1000;
const pgStore = new connectPgSimple(session);
const app = express();
const allowedOrigins = ['http://localhost:5173', 'https://cloud-storage-odin.vercel.app'];
const allowedRegex = /^https:\/\/cloud-storage-odin.*\.vercel\.app$/;

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || origin === 'http://localhost:5173' || allowedRegex.test(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

app.use(
    session({
        store: new pgStore({ pool, createTableIfMissing: true }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: ONE_DAY,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/folders', folderRoutes);

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

app.use((_, res) => {
    res.status(404).send({ message: 'Invalid route' });
});

export { app };
