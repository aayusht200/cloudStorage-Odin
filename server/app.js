import connectPgSimple from 'connect-pg-simple';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from './config/passport.js';
import pool from './config/Pool.js';
import { router as userRoutes } from './routes/userRouter.js';

const ONE_DAY = 24 * 60 * 60 * 1000;
const pgStore = new connectPgSimple(session);
const app = express();

app.use(cors({ origin: process.env.ORIGIN, credentials: true })); //cors setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use((err, req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

app.use((req, res) => {
    res.status(404).send({ message: 'Invalid route' });
});

export { app };
