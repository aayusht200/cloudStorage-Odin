import 'dotenv/config';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../app.js';

describe('User routes', () => {
    describe('POST /api/users/signup', () => {
        let payload;

        beforeEach(() => {
            payload = {
                email: `test-${crypto.randomUUID()}@gmail.com`,
                password: 'Test@123',
                firstName: 'Test',
                lastName: 'User',
            };
        });
        describe('success', () => {
            it('should create a new user', async () => {
                // Act
                const response = await request(app).post('/api/users/signup').send(payload);

                // Assert

                expect(response.status).toBe(201);
                expect(response.body).toEqual({
                    message: 'User created',
                });
            });
        });

        describe('failure', () => {
            it('should reject invalid input', async () => {
                // Act
                const response = await request(app)
                    .post('/api/users/signup')
                    .send({ ...payload, password: undefined });

                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors.fieldErrors).toHaveProperty('password');
            });

            it('should reject an existing user', async () => {
                // Act
                const response = await request(app)
                    .post('/api/users/signup')
                    .send({ ...payload, email: 'james.bond@gmail.com' });
                // Assert
                expect(response.status).toBe(409);
                expect(response.body).toEqual({ message: 'User already exists' });
            });
        });
    });
    describe('GET /api/users/me', () => {
        let payload;
        let agent;
        beforeEach(() => {
            payload = {
                email: 'james.bond@gmail.com',
                password: 'James@123',
            };
            agent = request.agent(app);
        });
        describe('success', () => {
            it('should return the authenticated user', async () => {
                // Act
                const loginResponse = await agent.post('/api/users/login').send(payload);
                const response = await agent.get('/api/users/me');
                // Assert
                expect(response.status).toBe(200);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        id: expect.any(String),
                        email: expect.any(String),
                        firstName: expect.any(String),
                        lastName: expect.any(String),
                        role: expect.any(String),
                        rootFolderId: expect.any(String),
                    })
                );
            });
        });

        describe('failure', () => {
            it('should return 401 when the user is not authenticated', async () => {
                // Arrange
                const loginResponse = await agent.post('/api/users/login').send({ ...payload, password: 'Test@123' });
                const response = await agent.get('/api/users/me');
                // Assert
                expect(response.status).toBe(401);
                expect(response.body).toEqual({ message: 'Unauthorized' });
            });

            it('should return 401 when the session is invalid', async () => {
                // Arrange
                const response = await request(app).get('/api/users/me');
                // Assert
                expect(response.status).toBe(401);
                expect(response.body).toEqual({ message: 'Unauthorized' });
            });
        });
    });
    describe('POST /api/users/login', () => {
        let payload;
        beforeEach(() => {
            payload = {
                email: 'james.bond@gmail.com',
                password: 'James@123',
            };
        });
        describe('success', () => {
            it('should login the user and create a session', async () => {
                // Act
                const response = await request(app).post('/api/users/login').send(payload);
                // Assert
                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Logged in');
                expect(response.headers['set-cookie'][0]).toContain('connect.sid');
            });
        });

        describe('failure', () => {
            it('should reject invalid credentials', async () => {
                // Act
                const response = await request(app)
                    .post('/api/users/login')
                    .send({ ...payload, password: 'Test@1234' });
                // Assert
                expect(response.status).toBe(401);
                expect(response.body).toEqual({ message: 'Invalid credentials' });
                expect(response.headers).not.toHaveProperty('set-cookie');
            });

            it('should reject invalid input', async () => {
                // Act
                const response = await request(app)
                    .post('/api/users/login')
                    .send({ ...payload, password: 'test@123' });
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors.fieldErrors).toHaveProperty('password');
                expect(response.headers).not.toHaveProperty('set-cookie');
            });
        });
    });
    describe('POST /api/users/logout', () => {
        let agent;
        let payload;

        beforeEach(() => {
            agent = request.agent(app);

            payload = {
                email: 'james.bond@gmail.com',
                password: 'James@123',
            };
        });

        describe('success', () => {
            it('should logout the authenticated user and destroy the session', async () => {
                // Arrange
                await agent.post('/api/users/login').send(payload);
                const response = await agent.get('/api/users/me');
                const logoutResponse = await agent.post('/api/users/logout');
                const afterLogout = await agent.get('/api/users/me');
                // Login using agent
                // Assert
                expect(response.status).toBe(200);
                // Logout using agent
                // Assert
                expect(logoutResponse.status).toBe(200);
                expect(logoutResponse.body).toEqual({ message: 'Logged out' });
                expect(logoutResponse.headers['set-cookie']).toEqual(
                    expect.arrayContaining([expect.stringContaining('connect.sid=;')])
                );
                expect(afterLogout.status).toBe(401);
                expect(afterLogout.body).toEqual({ message: 'Unauthorized' });
            });
        });

        describe('failure', () => {
            it('should reject an unauthenticated request', async () => {
                // Act
                const logoutResponse = await agent.post('/api/users/logout');

                // Assert
                expect(logoutResponse.status).toBe(401);
                expect(logoutResponse.body).toEqual({
                    message: 'Unauthorized',
                });
            });
        });
    });
});
