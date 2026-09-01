import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../app.js';
import { cleanupTestUsers, createAuthenticatedAgent } from './testUtils.js';

describe('Folder routes', () => {
    let agent;
    let payload;
    let createdEmails;
    let csrfToken;
    beforeEach(() => {
        agent = request.agent(app);
        createdEmails = [];

        payload = {
            folderName: `Test Folder ${crypto.randomUUID()}`,
            parentId: crypto.randomUUID(),
        };
    });

    afterEach(async () => {
        await cleanupTestUsers(createdEmails);
    });

    const authenticate = async () => {
        const auth = await createAuthenticatedAgent();
        agent = auth.agent;
        payload.parentId = auth.rootFolderId;
        createdEmails.push(auth.payload.email);
        csrfToken = auth.csrfToken;
    };

    describe('POST /api/folders/create', () => {
        describe('success', () => {
            it('should create a folder', async () => {
                // Arrange
                // Login using agent
                await authenticate();
                // Act
                const createResponse = await agent
                    .post('/api/folders/create')
                    .set('x-csrf-token', csrfToken)
                    .send(payload);
                // Assert
                expect(createResponse.status).toBe(201);
                expect(createResponse.body).toEqual({ message: 'Folder created successfully', id: expect.any(String) });
            });
        });

        describe('failure', () => {
            it('should reject an unauthenticated request', async () => {
                // Act
                const createResponse = await agent
                    .post('/api/folders/create')
                    .set('x-csrf-token', csrfToken)
                    .send(payload);
                // Assert
                expect(createResponse.status).toBe(401);
                expect(createResponse.body).toEqual({
                    message: 'Unauthorized',
                });
            });

            it('should reject invalid input', async () => {
                // Login using agent
                await authenticate();
                // Act
                const createResponse = await agent
                    .post('/api/folders/create')
                    .set('x-csrf-token', csrfToken)
                    .send({ ...payload, parentId: undefined });
                // Assert
                expect(createResponse.status).toBe(400);
                expect(createResponse.body.errors.fieldErrors).toEqual({ parentId: [expect.any(String)] });
            });

            it('should reject a duplicate folder name', async () => {
                // Login using agent
                await authenticate();
                // Act
                await agent.post('/api/folders/create').set('x-csrf-token', csrfToken).send(payload);
                const secondCreateReq = await agent
                    .post('/api/folders/create')
                    .set('x-csrf-token', csrfToken)
                    .send(payload);
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
                await authenticate();
                // Act
                const createResponse = await agent
                    .post('/api/folders/create')
                    .set('x-csrf-token', csrfToken)
                    .send(payload);
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
                await authenticate();
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
                await authenticate();
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
                await authenticate();
                const createResponse = await agent
                    .post('/api/folders/create')
                    .set('x-csrf-token', csrfToken)
                    .send(payload);
                // Act
                const deleteResponse = await agent
                    .delete(`/api/folders/${createResponse.body.id}`)
                    .set('x-csrf-token', csrfToken);
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
                await authenticate();
                // Act
                const deleteResponse = await agent.delete(`/api/folders/undefined`).set('x-csrf-token', csrfToken);
                // Assert
                expect(deleteResponse.status).toBe(400);
                expect(deleteResponse.body.errors.fieldErrors).toEqual({
                    id: [expect.any(String)],
                });
            });

            it('should return 404 when the folder does not exist', async () => {
                // Arrange
                // Login using agent
                await authenticate();
                // Act
                const deleteResponse = await agent
                    .delete(`/api/folders/${crypto.randomUUID()}`)
                    .set('x-csrf-token', csrfToken);
                // Assert
                expect(deleteResponse.status).toBe(404);
                expect(deleteResponse.body).toEqual({ message: 'Folder with id not found' });
            });
        });
    });
});
