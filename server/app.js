import cors from 'cors';
import session from 'express-session';
import express from 'express';
const app = express();

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
