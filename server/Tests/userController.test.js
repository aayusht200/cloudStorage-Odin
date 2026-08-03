import bcrypt from 'bcrypt';
import { beforeEach, describe, it, vi } from 'vitest';
import prisma from '../config/Connection';
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
            json: vi.fn(),
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
            // Act
            // Assert
            // - findUnique called with email
            // - bcrypt.hash called with password
            // - transaction called
            // - tx.user.create called
            // - tx.folder.create called
            // - status 201
            // - success message returned
        });
    });

    describe('failure', () => {
        describe('when the user already exists', () => {
            beforeEach(() => {
                // Arrange:
                // - prisma.user.findUnique -> existing user
            });

            it('returns 409 and does not continue with signup', async () => {
                // Assert
                // - status 409
                // - error message
                // - bcrypt.hash NOT called
                // - transaction NOT called
            });
        });

        describe('when checking for an existing user fails', () => {
            beforeEach(() => {
                // Arrange:
                // - prisma.user.findUnique throws
            });

            it('passes the error to next()', async () => {});
        });

        describe('when password hashing fails', () => {
            beforeEach(() => {
                // Arrange:
                // - findUnique -> null
                // - bcrypt.hash throws
            });

            it('passes the error to next()', async () => {});
        });

        describe('when the transaction fails', () => {
            beforeEach(() => {
                // Arrange:
                // - findUnique -> null
                // - bcrypt.hash succeeds
                // - transaction throws
            });

            it('passes the error to next()', async () => {});
        });
    });
});
