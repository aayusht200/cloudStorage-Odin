import { describe, expect, it, vi } from 'vitest';
import { csrfVerification } from '../../middleware/csrfMiddleware';
describe('CSRF Middleware', () => {
    it('should call next on valid csrf token ', () => {
        //Arrange
        const token = crypto.randomUUID();
        const res = vi.fn();
        const next = vi.fn();
        const req = { session: { csrfToken: token }, headers: { 'x-csrf-token': token } };
        //Act
        csrfVerification(req, res, next);
        //Assert
        expect(next).toHaveBeenCalled();
    });

    it('returns error on invalid csrf token', () => {
        //Arrange
        const token = crypto.randomUUID();
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        const next = vi.fn();
        const req = { session: { csrfToken: crypto.randomUUID() }, headers: { 'x-csrf-token': token } };
        //Act
        csrfVerification(req, res, next);
        //Assert
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid CSRF token',
        });
        expect(next).not.toHaveBeenCalled();
    });
    it('returns error on missing csrf token', () => {
        //Arrange
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        const next = vi.fn();
        const req = { session: { csrfToken: crypto.randomUUID() }, headers: { 'x-csrf-token': null } };
        //Act
        csrfVerification(req, res, next);
        //Assert
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid CSRF token',
        });
        expect(next).not.toHaveBeenCalled();
    });
});
