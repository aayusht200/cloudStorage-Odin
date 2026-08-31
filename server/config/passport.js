import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import prisma from './Connection.js';
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const result = await prisma.user.findUnique({ where: { email } });
            if (result === null) {
                return done(null, false, {
                    message: 'No user found',
                });
            }
            const isAuthenticated = await bcrypt.compare(password, result.password);
            if (!isAuthenticated) {
                return done(null, false, {
                    message: 'Invalid credentials',
                });
            }
            const safeUser = { ...result };
            delete safeUser.password;

            return done(null, safeUser);
        } catch (error) {
            return done(error);
        }
    })
);
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await prisma.user.findUnique({ where: { id } });

        if (result === null) {
            return done(null, false);
        }

        const safeUser = { ...result };
        delete safeUser.password;

        return done(null, safeUser);
    } catch (error) {
        return done(error);
    }
});
export default passport;
