import { beforeEach, describe, expect, it } from 'vitest';
import { validate } from '../middleware/validate';
import { signupSchema } from '../schema/auth';
import { createFileSchema, idSchema } from '../schema/file.js';

describe('validate middleware', () => {
    let req;
    let res;
    let next;
    let result;
    beforeEach(() => {
        req = {
            body: {
                email: 'test@test.com',
                password: 'Test@123',
                firstName: 'Aayush',
                lastName: 'Trivedi',
            },
            file: {
                originalname: 'demoFile',
                mimetype: 'image/jpeg',
                size: 485760,
                buffer: Buffer.from('hello world!'),
            },
            params: {
                id: crypto.randomUUID(),
            },
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        next = vi.fn();
        vi.clearAllMocks();
    });
    describe('body validation', () => {
        beforeEach(() => {
            result = validate(signupSchema);
        });
        describe('valid body', () => {
            it('calls next()', () => {
                result(req, res, next);
                expect(next).toHaveBeenCalled();
            });

            it('does not send a response', () => {
                result(req, res, next);
                expect(res.status).not.toHaveBeenCalled();
                expect(res.json).not.toHaveBeenCalled();
            });

            it('replaces req.body with parsed data', () => {
                const copyReq = {
                    ...req,
                    body: {
                        ...req.body,
                        email: 'test@test.com   ',
                    },
                };
                result(copyReq, res, next);
                expect(copyReq.body).toEqual(req.body);
            });
        });

        describe('invalid body', () => {
            it('returns status 400', () => {
                result(
                    {
                        ...req,
                        body: {
                            ...req.body,
                            email: 'testtest.com',
                        },
                    },
                    res,
                    next
                );
                expect(res.status).toHaveBeenCalledWith(400);
            });
            it('returns validation errors', () => {
                result(
                    {
                        ...req,
                        body: {
                            ...req.body,
                            email: 'testtest.com',
                        },
                    },
                    res,
                    next
                );
                expect(res.json).toHaveBeenCalledWith(
                    expect.objectContaining({
                        errors: expect.any(Object),
                    })
                );
            });

            it('does not call next()', () => {
                result(
                    {
                        ...req,
                        body: {
                            ...req.body,
                            email: 'testtest.com',
                        },
                    },
                    res,
                    next
                );
                expect(next).not.toHaveBeenCalled();
            });
        });
    });

    describe('params validation', () => {
        beforeEach(() => {
            result = validate(idSchema, 'params');
        });
        describe('valid params', () => {
            it('calls next()', () => {
                result(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });

        describe('invalid params', () => {
            it('returns status 400', () => {
                result(
                    {
                        ...req,
                        params: { id: `not a uuid` },
                    },
                    res,
                    next
                );
                expect(res.status).toHaveBeenCalledWith(400);
            });

            it('does not call next()', () => {
                const copyReq = {
                    ...req,
                    params: { id: `not a uuid` },
                };
                result(copyReq, res, next);
                expect(next).not.toHaveBeenCalled();
            });
        });
    });

    describe('file validation', () => {
        beforeEach(() => {
            result = validate(createFileSchema, 'file');
        });
        describe('valid file', () => {
            it('calls next()', () => {
                result(req, res, next);
                expect(next).toHaveBeenCalled();
            });

            it('replaces req.file with parsed data', () => {
                const copyReq = {
                    ...req,
                    file: {
                        ...req.file,
                        originalname: 'testFileName  ',
                    },
                };
                result(copyReq, res, next);
                expect(copyReq.file.originalname).toBe('testFileName');
            });
        });

        describe('invalid file', () => {
            it('returns status 400', () => {
                const copyReq = {
                    ...req,
                    file: {
                        ...req.file,
                        mimetype: 'application/msword',
                    },
                };
                result(copyReq, res, next);
                expect(res.status).toHaveBeenCalledWith(400);
            });

            it('does not call next()', () => {
                const copyReq = {
                    ...req,
                    file: {
                        ...req.file,
                        mimetype: 'application/msword',
                    },
                };
                result(copyReq, res, next);
                expect(next).not.toHaveBeenCalled();
            });
        });
    });
});
