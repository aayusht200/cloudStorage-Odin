import bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import prisma from '../config/Connection';
import { signupUser } from '../controller/userController';
vi.mock('../config/Connection.js', () => ({
    default: {
        user: {
            findUnique: vi.fn(),
        },
        folder: {
            create: vi.fn(),
        },
        $transaction: vi.fn(),
    },
}));
vi.mock('bcrypt', () => ({
    default: {
        hash: vi.fn(),
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
