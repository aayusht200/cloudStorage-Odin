import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../app.js';
describe('Folder routes', () => {
    let agent;
    let payload;

    beforeEach(() => {
        agent = request.agent(app);

        payload = {
            folderName: `Test Folder ${crypto.randomUUID()}`,
            parentId: '28860744-fae5-4514-a7d1-2afe05d8b99f',
        };
    });

    describe('POST /api/folders/create', () => {
        describe('success', () => {
            it('should create a folder', async () => {
                // Arrange
                // Login using agent
                await agent.post('/api/users/login').send({
                    email: 'testuser@gmail.com',
                    password: 'Test@123',
                });
                // Act
                const createResponse = await agent.post('/api/folders/create').send(payload);
                // Assert
                expect(createResponse.status).toBe(201);
                expect(createResponse.body).toEqual({ message: 'Folder created successfully', id: expect.any(String) });
            });
        });

        describe('failure', () => {
            it('should reject an unauthenticated request', async () => {
                // Act
                const createResponse = await agent.post('/api/folders/create').send(payload);
                // Assert
                expect(createResponse.status).toBe(401);
                expect(createResponse.body).toEqual({
                    message: 'Unauthorized',
                });
            });

            it('should reject invalid input', async () => {
                // Login using agent
                await agent.post('/api/users/login').send({
                    email: 'testuser@gmail.com',
                    password: 'Test@123',
                });
                // Act
                const createResponse = await agent
                    .post('/api/folders/create')
                    .send({ ...payload, parentId: undefined });
                // Assert
                expect(createResponse.status).toBe(400);
                expect(createResponse.body.errors.fieldErrors).toEqual({ parentId: [expect.any(String)] });
            });

            it('should reject a duplicate folder name', async () => {
                // Login using agent
                await agent.post('/api/users/login').send({
                    email: 'testuser@gmail.com',
                    password: 'Test@123',
                });
                // Act
                await agent.post('/api/folders/create').send(payload);
                const secondCreateReq = await agent.post('/api/folders/create').send(payload);
                // Assert
                expect(secondCreateReq.status).toBe(409);
                expect(secondCreateReq.body).toEqual({ message: 'Folder with same name exists' });
            });
        });
    });

    describe('GET /api/folders/:id', () => {
        describe('success', () => {
            it('should return the folder', async () => {
                // Arrange
                // Login using agent
                await agent.post('/api/users/login').send({
                    email: 'testuser@gmail.com',
                    password: 'Test@123',
                });
                // Act
                const createResponse = await agent.post('/api/folders/create').send(payload);
                // Assert
                const infoResponse = await agent.get(`/api/folders/${createResponse.body.id}`);
                expect(infoResponse.status).toBe(200);
                expect(infoResponse.body).toEqual(
                    expect.objectContaining({
                        id: createResponse.body.id,
                        folderName: payload.folderName,
                        files: [],
                        children: [],
                        path: expect.any(Array),
                    })
                );
                expect(infoResponse.body.createdAt).toEqual(expect.any(String));
                expect(infoResponse.body.parentId).toEqual(expect.any(String));
            });
        });

        describe('failure', () => {
            it('should reject an unauthenticated request', async () => {
                // Act
                const infoResponse = await agent.get(`/api/folders/${payload.parentId}`);
                // Assert
                expect(infoResponse.status).toBe(401);
                expect(infoResponse.body).toEqual({
                    message: 'Unauthorized',
                });
            });

            it('should reject an invalid folder id', async () => {
                // Arrange
                // Login using agent
                await agent.post('/api/users/login').send({
                    email: 'testuser@gmail.com',
                    password: 'Test@123',
                });
                // Act
                const infoResponse = await agent.get(`/api/folders/undefined`);
                // Assert
                expect(infoResponse.status).toBe(400);
                expect(infoResponse.body.errors.fieldErrors).toEqual({
                    id: [expect.any(String)],
                });
            });

            it('should return 404 when the folder does not exist', async () => {
                // Arrange
                await agent.post('/api/users/login').send({
                    email: 'testuser@gmail.com',
                    password: 'Test@123',
                });
                // Act
                const infoResponse = await agent.get(`/api/folders/${crypto.randomUUID()}`);
                // Assert
                expect(infoResponse.status).toBe(404);
                expect(infoResponse.body).toEqual({ message: 'Folder with id not found' });
            });
        });
    });

    describe('DELETE /api/folders/:id', () => {
        describe('success', () => {
            it('should delete the folder', async () => {
                // Arrange
                await agent.post('/api/users/login').send({
                    email: 'testuser@gmail.com',
                    password: 'Test@123',
                });
                const createResponse = await agent.post('/api/folders/create').send(payload);
                // Act
                const deleteResponse = await agent.delete(`/api/folders/${createResponse.body.id}`);
                // Assert
                expect(deleteResponse.status).toBe(200);
                expect(deleteResponse.body).toEqual({ message: 'Folder delete successfully' });
            });
        });

        describe('failure', () => {
            it('should reject an unauthenticated request', async () => {
                // Act
                const deleteResponse = await agent.delete(`/api/folders/${payload.parentId}`);
                // Assert
                expect(deleteResponse.status).toBe(401);
                expect(deleteResponse.body).toEqual({
                    message: 'Unauthorized',
                });
            });

            it('should reject an invalid folder id', async () => {
                // Arrange
                // Login using agent
                await agent.post('/api/users/login').send({
                    email: 'testuser@gmail.com',
                    password: 'Test@123',
                });
                // Act
                const deleteResponse = await agent.delete(`/api/folders/undefined`);
                // Assert
                expect(deleteResponse.status).toBe(400);
                expect(deleteResponse.body.errors.fieldErrors).toEqual({
                    id: [expect.any(String)],
                });
            });

            it('should return 404 when the folder does not exist', async () => {
                // Arrange
                // Login using agent
                await agent.post('/api/users/login').send({
                    email: 'testuser@gmail.com',
                    password: 'Test@123',
                });
                // Act
                const deleteResponse = await agent.delete(`/api/folders/${crypto.randomUUID()}`);
                // Assert
                expect(deleteResponse.status).toBe(404);
                expect(deleteResponse.body).toEqual({ message: 'Folder with id not found' });
            });
        });
    });
});
