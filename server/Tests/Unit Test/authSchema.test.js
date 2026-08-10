import { describe, expect, it } from 'vitest';
import { loginSchema, signupSchema } from '../../schema/auth';

describe('loginSchema', () => {
    describe('valid credentials', () => {
        it('accepts valid credentials', () => {
            const sample = { email: 'test@gmail.com', password: 'Test@123' };
            expect(loginSchema.parse(sample)).toEqual(sample);
        });
    });

    describe('email validation', () => {
        it('rejects invalid email', () => {
            const result = loginSchema.safeParse({ email: 'testgmail.com', password: 'Test@123' });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].code).toBe('invalid_format');
        });

        it('rejects empty email', () => {
            const result = loginSchema.safeParse({ email: '', password: 'Test@123' });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].code).toBe('too_small');
        });
    });

    describe('password validation', () => {
        describe('length', () => {
            it('accepts password with minimum length', () => {
                expect(loginSchema.safeParse({ email: 'test@test.com', password: 'Test@123' }).success).toBe(true);
            });

            it('accepts password with maximum length', () => {
                const longPass = 'Test@67891234567891234567897898789789789787997887978897984566454';
                expect(
                    loginSchema.safeParse({
                        email: 'test@test.com',
                        password: longPass,
                    }).success
                ).toBe(true);
            });

            it('rejects short password', () => {
                expect(loginSchema.safeParse({ email: 'test@test.com', password: 'Test@12' }).success).toBe(false);
            });

            it('rejects password longer than maximum length', () => {
                const longPass = 'Test@678912345678912345678978987897897897879978879788979845664541';
                expect(
                    loginSchema.safeParse({
                        email: 'test@test.com',
                        password: longPass,
                    }).success
                ).toBe(false);
            });
        });

        describe('complexity', () => {
            it('rejects password without uppercase letter', () => {
                expect(loginSchema.safeParse({ email: 'test@test.com', password: 'est@123' }).success).toBe(false);
            });

            it('rejects password without lowercase letter', () => {
                expect(loginSchema.safeParse({ email: 'test@test.com', password: 'TEST@123' }).success).toBe(false);
            });

            it('rejects password without number', () => {
                expect(loginSchema.safeParse({ email: 'test@test.com', password: 'TEST@test' }).success).toBe(false);
            });

            it('rejects password without special character', () => {
                expect(loginSchema.safeParse({ email: 'test@test.com', password: 'TESTtest123' }).success).toBe(false);
            });
        });
    });
});

describe('signupSchema', () => {
    const signupData = {
        email: 'test@test.com',
        password: 'Test@123',
        firstName: 'Aayush',
        lastName: 'Trivedi',
    };
    describe('valid signup', () => {
        it('accepts valid signup credentials', () => {
            expect(signupSchema.safeParse(signupData).success).toBe(true);
        });
    });

    describe('email validation', () => {
        it('rejects invalid email', () => {
            expect(signupSchema.safeParse({ ...signupData, email: 'test.test.com' }).success).toBe(false);
        });

        it('rejects empty email', () => {
            expect(signupSchema.safeParse({ ...signupData, email: '' }).success).toBe(false);
        });

        it('trims surrounding whitespace', () => {
            expect(signupSchema.safeParse({ ...signupData, email: `${signupData.email}   ` }).success).toBe(true);
        });
    });

    describe('password validation', () => {
        it('rejects an invalid password', () => {
            expect(signupSchema.safeParse({ ...signupData, password: 'test@123' }).success).toBe(false);
        });
    });

    describe('firstName validation', () => {
        it('accepts a valid first name', () => {
            expect(signupSchema.safeParse({ ...signupData, firstName: 123 }).success).toBe(false);
        });

        it('rejects an empty first name', () => {
            expect(signupSchema.safeParse({ ...signupData, firstName: '' }).success).toBe(false);
        });

        it('trims surrounding whitespace', () => {
            expect(signupSchema.parse({ ...signupData, firstName: `${signupData.firstName}  ` })).toEqual(signupData);
        });
    });

    describe('lastName validation', () => {
        it('accepts a valid last name', () => {
            expect(signupSchema.safeParse(signupData).success).toBe(true);
        });

        it('rejects an empty last name', () => {
            expect(signupSchema.safeParse({ ...signupData, lastName: '' }).success).toBe(false);
        });

        it('trims surrounding whitespace', () => {
            expect(signupSchema.parse({ ...signupData, lastName: `${signupData.lastName}  ` })).toEqual(signupData);
        });
    });
});
