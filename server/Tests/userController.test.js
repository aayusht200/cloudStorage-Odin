import bcrypt from 'bcrypt';
import passport from 'passport';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import prisma from '../config/Connection';
import { getUserById, loginUser, logoutUser, signupUser } from '../controller/userController';
vi.mock('../config/Connection.js', () => ({
    default: {
        user: {
            findUnique: vi.fn(),
        },
        folder: {
            create: vi.fn(),
            findFirst: vi.fn(),
        },
        $transaction: vi.fn(),
    },
}));
vi.mock('bcrypt', () => ({
    default: {
        hash: vi.fn(),
    },
}));
vi.mock('passport', () => ({
    default: {
        authenticate: vi.fn(),
    },
}));

describe('signupUser', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            body: {
                email: 'test@test.com',
                password: 'Test@123',
                firstName: 'Aayush',
                lastName: 'Trivedi',
            },
        };
        res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };
        next = vi.fn();
    });
    describe('success', () => {
        let tx;

        beforeEach(() => {
            vi.clearAllMocks();
            // Arrange:
            // - prisma.user.findUnique -> null
            prisma.user.findUnique.mockResolvedValue(null);
            // - bcrypt.hash -> hashed password
            bcrypt.hash.mockResolvedValue('hashPassword');
            // - prisma.$transaction -> success
            tx = {
                user: {
                    create: vi.fn().mockResolvedValue({
                        id: 'user-id',
                    }),
                },
                folder: {
                    create: vi.fn().mockResolvedValue({}),
                },
            };

            prisma.$transaction.mockImplementation(async (callback) => {
                await callback(tx);
            });
        });

        it('creates a user and root folder, then returns 201', async () => {
            // Arrange
            await signupUser(req, res, next);
            // Act
            // Assert
            // - findUnique called with email
            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: req.body.email } });
            // - bcrypt.hash called with password
            expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
            // - transaction called
            expect(prisma.$transaction).toHaveBeenCalled();
            // - tx.user.create called
            expect(tx.user.create).toHaveBeenCalledWith({
                data: {
                    email: req.body.email,
                    password: `hashPassword`,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                },
            });
            // - tx.folder.create called
            expect(tx.folder.create).toHaveBeenCalledWith({
                data: {
                    folderName: 'root',
                    userId: 'user-id',
                },
            });
            // - status 201
            expect(res.status).toHaveBeenCalledWith(201);
            // - success message returned
            expect(res.send).toHaveBeenCalledWith({
                message: 'User created',
            });
        });
    });

    describe('failure', () => {
        describe('when the user already exists', () => {
            beforeEach(() => {
                vi.clearAllMocks();
                // Arrange:
                // - prisma.user.findUnique -> existing user
                prisma.user.findUnique.mockResolvedValue({
                    id: 'user-id',
                    email: req.body.email,
                });
            });

            it('returns 409 and does not continue with signup', async () => {
                await signupUser(req, res, next);
                // Assert
                expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: req.body.email } });
                // - status 409
                expect(res.status).toHaveBeenCalledWith(409);
                // - error message
                expect(res.send).toHaveBeenCalledWith({ message: 'User already exists' });
                // - bcrypt.hash NOT called
                expect(bcrypt.hash).not.toHaveBeenCalled();
                // - transaction NOT called
                expect(prisma.$transaction).not.toHaveBeenCalled();
            });
        });

        describe('when checking for an existing user fails', () => {
            it('passes the error to next()', async () => {
                vi.clearAllMocks();
                // Arrange:
                const error = new Error('Database error');
                // - prisma.user.findUnique throws
                prisma.user.findUnique.mockRejectedValue(error);

                await signupUser(req, res, next);

                expect(next).toHaveBeenCalledWith(error);
            });
        });

        describe('when password hashing fails', () => {
            beforeEach(() => {
                vi.clearAllMocks();
            });
            it('passes the error to next()', async () => {
                // Arrange:
                const error = new Error('Hashing error');

                // - findUnique -> null
                prisma.user.findUnique.mockResolvedValue();

                // - bcrypt.hash throws
                bcrypt.hash.mockRejectedValue(error);

                await signupUser(req, res, next);

                expect(next).toHaveBeenCalledWith(error);
            });
        });

        describe('when the transaction fails', () => {
            it('passes the error to next()', async () => {
                vi.clearAllMocks();
                const error = new Error('Transaction error');
                // Arrange:
                // - findUnique -> null
                prisma.user.findUnique.mockResolvedValue(null);
                // - bcrypt.hash succeeds
                bcrypt.hash.mockResolvedValue('hashedPassword');
                // - transaction throws
                prisma.$transaction.mockRejectedValue(error);

                await signupUser(req, res, next);

                expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: req.body.email } });

                expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);

                expect(res.status).not.toHaveBeenCalled();

                expect(next).toHaveBeenCalledWith(error);
            });
        });
    });
});

describe('getUserById', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            user: {
                id: 'user-id',
            },
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        next = vi.fn();
    });

    describe('success', () => {
        it('returns the user and root folder information', async () => {
            // Arrange:
            const user = {
                id: 'user-id',
                email: 'test@gmail.com',
                firstName: 'Aayush',
                lastName: 'Trivedi',
                role: 'user',
            };
            const rootFolder = { id: 'folder-id' };

            // - prisma.user.findUnique -> existing user
            prisma.user.findUnique.mockResolvedValue(user);

            // - prisma.folder.findFirst -> root folder
            prisma.folder.findFirst.mockResolvedValue(rootFolder);

            // Act
            await getUserById(req, res, next);
            // Assert
            // - user lookup called with id
            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: req.user.id } });
            // - root folder lookup called
            expect(prisma.folder.findFirst).toHaveBeenCalledWith({
                where: { userId: req.user.id, folderName: 'root' },
            });
            // - status 200
            expect(res.status).toHaveBeenCalledWith(200);
            // - correct response returned
            expect(res.json).toHaveBeenCalledWith({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                rootFolderId: rootFolder.id,
            });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('failure', () => {
        describe('when req.user is missing', () => {
            beforeEach(() => {
                // Arrange:
                // - req.user = undefined
                req = { user: undefined };
            });

            it('returns 404 without querying the database', async () => {
                // Assert
                await getUserById(req, res, next);
                // - status 404
                expect(res.status).toHaveBeenCalledWith(404);
                // - error message
                expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
                // - user lookup NOT called
                expect(prisma.user.findUnique).not.toHaveBeenCalled();
                // - folder lookup NOT called
                expect(prisma.folder.findFirst).not.toHaveBeenCalled();
                // - next NOT called
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('when the user does not exist', () => {
            beforeEach(() => {
                // Arrange:

                // - prisma.user.findUnique -> null
                prisma.user.findUnique.mockResolvedValue(null);
                // - prisma.folder.findFirst -> valid root folder
                prisma.folder.findFirst.mockResolvedValue({ folderId: 'root-id' });
            });

            it('returns 404', async () => {
                // Assert
                await getUserById(req, res, next);
                // - status 404
                expect(res.status).toHaveBeenCalledWith(404);
                // - error message
                expect(res.json).toHaveBeenCalledWith({
                    message: 'User not found',
                });
            });
        });

        describe('when the root folder does not exist', () => {
            beforeEach(() => {
                // Arrange:
                const user = {
                    id: 'user-id',
                    email: 'test@gmail.com',
                    firstName: 'Aayush',
                    lastName: 'Trivedi',
                    role: 'user',
                };
                // - prisma.user.findUnique -> valid user
                prisma.user.findUnique.mockResolvedValue(user);
                // - prisma.folder.findFirst -> null
                prisma.folder.findFirst.mockResolvedValue(null);
            });

            it('returns 500', async () => {
                // Assert
                await getUserById(req, res, next);
                // - status 500
                expect(res.status).toHaveBeenCalledWith(500);
                // - error message
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Root folder missing',
                });
            });
        });

        describe('when fetching the user fails', () => {
            it('passes the error to next()', async () => {
                // Arrange:
                const error = new Error({ message: 'No unique user found' });
                // - prisma.user.findUnique throws
                prisma.user.findUnique.mockRejectedValue(error);
                // Assert
                await getUserById(req, res, next);
                // - next called with error
                expect(next).toHaveBeenCalledWith(error);
            });
        });

        describe('when fetching the root folder fails', () => {
            it('passes the error to next()', async () => {
                // Arrange:
                const error = new Error({ message: 'No root folder found' });
                // - prisma.folder.findFirst throws
                prisma.folder.findFirst.mockRejectedValue(error);
                // Assert
                await getUserById(req, res, next);
                // - next called with error
                expect(next).toHaveBeenCalledWith(error);
            });
        });
    });
});

describe('loginUser', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            body: {
                email: 'test@test.com',
                password: 'Test@123',
            },
            login: vi.fn(),
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        next = vi.fn();
    });
    describe('success', () => {
        beforeEach(() => {
            passport.authenticate.mockImplementation((strategy, callback) => {
                return (req, res, next) =>
                    callback(
                        null,
                        {
                            id: 'user-id',
                            email: 'test@test.com',
                        },
                        null
                    );
            });
            req.login.mockImplementation((user, callback) => {
                callback(null);
            });
        });
        it('Login succeeds', async () => {
            //Assert
            await loginUser(req, res, next);
            //passport.authenticate called
            expect(passport.authenticate).toHaveBeenCalled();
            //req.login called with authenticated user
            expect(req.login).toHaveBeenCalled();
            //status 200 returned
            expect(res.status).toHaveBeenCalledWith(200);
            //success response returned
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('failure', () => {
        it('when passport returns an error', () => {
            //Arrange
            const error = new Error();
            passport.authenticate.mockImplementation((strategy, callback) => {
                return (req, res, next) => callback(error, null, null);
            });
            //Assert
            loginUser(req, res, next);
            //next(error) called
            expect(next).toHaveBeenCalledWith(error);
            //req.login NOT called
            expect(req.login).not.toHaveBeenCalled();
            //no response sent
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
        it('when authentication fails', () => {
            //Arrange
            const info = { message: 'authentication failed' };
            passport.authenticate.mockImplementation((_, callback) => {
                return (req, res, next) => callback(null, false, info);
            });
            //Assert
            loginUser(req, res, next);
            //status 401 returned
            expect(res.status).toHaveBeenCalledWith(401);
            //info object returned
            expect(res.json).toHaveBeenCalledWith(info);
            //req.login NOT called
            expect(req.login).not.toHaveBeenCalled();
            //next NOT called
            expect(next).not.toHaveBeenCalled();
        });
        it('when req.login fails', () => {
            //Arrange
            const error = new Error({ message: 'Login failed' });
            passport.authenticate.mockImplementation((_, callback) => {
                return (req, res, next) => callback(null, { id: 'user-id', email: 'test@test.com' }, null);
            });
            req.login.mockImplementation((_, callback) => {
                callback(error);
            });
            //Assert
            loginUser(req, res, next);
            //passport.authenticate succeeds
            expect(passport.authenticate).toHaveBeenCalledWith('local', expect.any(Function));
            //req.login called
            expect(req.login).toHaveBeenCalledWith({ id: 'user-id', email: 'test@test.com' }, expect.any(Function));
            //next(error) called
            expect(next).toHaveBeenCalledWith(error);
            //no success response sent
            expect(res.json).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });
});

describe('logoutUser', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        vi.clearAllMocks();
        // Arrange common request/response objects
        req = {
            session: {
                destroy: vi.fn(),
            },
            logout: vi.fn(),
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            clearCookie: vi.fn(),
        };
        next = vi.fn();
    });

    describe('success', () => {
        beforeEach(() => {
            // Arrange:
            // - req.logout succeeds
            req.logout.mockImplementation((callback) => {
                callback(null);
            });
            // - req.session.destroy succeeds
            req.session.destroy.mockImplementation((callback) => {
                callback(null);
            });
        });

        it('logs the user out, destroys the session, clears the cookie, and returns 200', () => {
            // Act
            logoutUser(req, res, next);
            // Assert
            // - req.logout called
            expect(req.logout).toHaveBeenCalledWith(expect.any(Function));
            // - req.session.destroy called
            expect(req.session.destroy).toHaveBeenCalledWith(expect.any(Function));
            //-clearCookie called with developer options
            expect(res.clearCookie).toHaveBeenCalledWith('connect.sid', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
            });
            // - status 200 returned
            expect(res.status).toHaveBeenCalledWith(200);
            // - success response returned
            expect(res.json).toHaveBeenCalledWith({
                message: 'Logged out',
            });
            // - next NOT called
            expect(next).not.toHaveBeenCalled();
        });
        it('clears the cookie with production options', () => {
            const original = process.env.NODE_ENV;
            try {
                process.env.NODE_ENV = 'production';
                // Act
                logoutUser(req, res, next);
                // Assert
                expect(res.clearCookie).toHaveBeenCalledWith('connect.sid', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
            } finally {
                process.env.NODE_ENV = original;
            }
        });
    });

    describe('failure', () => {
        describe('when req.logout fails', () => {
            it('passes the error to next()', () => {
                // Arrange:
                const error = new Error('req.logout failed');
                // - req.logout invokes callback with an error
                req.logout.mockImplementation((callback) => callback(error));
                // Act
                logoutUser(req, res, next);
                // Assert
                // - req.logout called
                expect(req.logout).toHaveBeenCalledWith(expect.any(Function));
                // - next(error) called
                expect(next).toHaveBeenCalledWith(error);
                // - req.session.destroy NOT called
                expect(req.session.destroy).not.toHaveBeenCalled();
                // - clearCookie NOT called
                expect(res.clearCookie).not.toHaveBeenCalled();
                // - no success response sent
                expect(res.json).not.toHaveBeenCalled();
                expect(res.status).not.toHaveBeenCalled();
            });
        });

        describe('when session destruction fails', () => {
            it('passes the error to next()', () => {
                // Arrange:
                const error = new Error('req.session.destroy failed');
                // - req.logout succeeds
                req.logout.mockImplementation((callback) => callback(null));
                // - req.session.destroy invokes callback with an error
                req.session.destroy.mockImplementation((callback) => callback(error));
                // Act
                logoutUser(req, res, next);
                // Assert
                // - req.logout called
                expect(req.logout).toHaveBeenCalledWith(expect.any(Function));
                // - req.session.destroy called
                expect(req.session.destroy).toHaveBeenCalledWith(expect.any(Function));
                // - next(error) called
                expect(next).toHaveBeenCalledWith(error);
                // - clearCookie NOT called
                expect(res.clearCookie).not.toHaveBeenCalled();
                // - no success response sent
                expect(res.json).not.toHaveBeenCalled();
                expect(res.status).not.toHaveBeenCalled();
            });
        });
    });
});
