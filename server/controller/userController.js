import prisma from '../config/Connection.js';
import passport from 'passport';
import bcrypt from 'bcrypt';
const getUserById = async (req, res, next) => {
    try {
        const result = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!result) {
            return res.status(404).json({
                message: 'User not found',
            });
        }
        const { password: _, ...safeUser } = result;
        return res.status(200).json(safeUser);
    } catch (error) {
        next(error);
    }
};

const loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json(info);
        }
        req.login(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({
                message: 'Logged in',
                user,
            });
        });
    })(req, res, next);
};
const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.session.destroy((err) => {
            if (err) return next(err);

            res.clearCookie('connect.sid', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            });

            return res.status(200).json({
                message: 'Logged out',
            });
        });
    });
};

const signupUser = async (req, res, next) => {
    const { email, password, lastName, firstName } = req.body;
    try {
        const alreadyUser = await prisma.user.findUnique({ where: { email } });
        if (alreadyUser) return res.status(409).send({ message: 'User already exists' });
        const hashPassword = await bcrypt.hash(password, 10);
        const result = await prisma.user.create({
            data: { email, password: hashPassword, firstName, lastName },
        });
        const { password: _, ...safeUser } = result;
        return res.status(201).send({
            message: 'User created',
        });
    } catch (error) {
        next(error);
    }
};

export { getUserById, loginUser, signupUser, logoutUser };
