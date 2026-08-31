import path from 'node:path';
import { fileURLToPath } from 'node:url';

import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { app } from '../../app.js';
import { cleanupTestUsers, createAuthenticatedAgent } from './testUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('File routes', () => {
    let agent;
    let folderId;
    let filePath;
    let fileId;
    let createdEmails;

    beforeEach(() => {
        agent = request.agent(app);
        folderId = crypto.randomUUID();
        filePath = path.join(__dirname, 'test.png');
        fileId = crypto.randomUUID();
        createdEmails = [];
    });

    afterEach(async () => {
        await cleanupTestUsers(createdEmails);
    });

    const authenticate = async () => {
        const auth = await createAuthenticatedAgent();

        agent = auth.agent;
        folderId = auth.rootFolderId;
        createdEmails.push(auth.payload.email);
    };

    const uploadTestFile = async () => {
        return agent.post('/api/files/create').field('folderId', folderId).attach('file', filePath);
    };

    describe('POST /api/files/create', () => {
        describe('success', () => {
            it('should upload a file', async () => {
                // Arrange
                await authenticate();

                // Act
                const createResponse = await uploadTestFile();

                // Assert
                expect(createResponse.status).toBe(201);
                expect(createResponse.body).toEqual({
                    message: 'File uploaded sucessfully',
                });
            });
        });

        describe('failure', () => {
            it('should reject an unauthenticated request', async () => {
                // Act
                const createResponse = await agent.post('/api/files/create');

                // Assert
                expect(createResponse.status).toBe(401);
                expect(createResponse.body).toEqual({
                    message: 'Unauthorized',
                });
            });

            it('should reject a request without a file', async () => {
                // Arrange
                await authenticate();

                // Act
                const createResponse = await agent.post('/api/files/create').field('folderId', folderId);

                // Assert
                expect(createResponse.status).toBe(400);
                expect(createResponse.body.errors.formErrors).toEqual([expect.any(String)]);
            });

            it('should reject invalid file input', async () => {
                // Arrange
                await authenticate();

                // Act
                const createResponse = await agent
                    .post('/api/files/create')
                    .field('folderId', folderId)
                    .attach('file', path.join(__dirname, 'Test.mov'));

                // Assert
                expect(createResponse.status).toBe(500);
                expect(createResponse.body).toEqual({});
            });

            it('should reject an invalid folder id', async () => {
                // Arrange
                await authenticate();

                // Act
                const createResponse = await agent
                    .post('/api/files/create')
                    .field('folderId', crypto.randomUUID())
                    .attach('file', filePath);

                // Assert
                expect(createResponse.status).toBe(400);
                expect(createResponse.body).toEqual({
                    message: 'Invalid folder Id',
                });
            });
        });
    });

    describe('GET /api/files/:id', () => {
        describe('success', () => {
            it('should return the file', async () => {
                // Arrange
                await authenticate();
                await uploadTestFile();

                const infoResponse = await agent.get(`/api/folders/${folderId}`);

                // Act
                const response = await agent.get(`/api/files/${infoResponse.body.files[0].id}`);

                // Assert
                expect(response.status).toBe(200);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        id: expect.any(String),
                        name: expect.any(String),
                        size: expect.any(Number),
                        type: expect.any(String),
                        updatedAt: expect.any(String),
                        url: expect.any(String),
                    })
                );
            });
        });

        describe('failure', () => {
            it('should reject an unauthenticated request', async () => {
                // Act
                const response = await agent.get(`/api/files/${fileId}`);

                // Assert
                expect(response.status).toBe(401);
                expect(response.body).toEqual({
                    message: 'Unauthorized',
                });
            });

            it('should reject an invalid file id', async () => {
                // Arrange
                await authenticate();

                // Act
                const response = await agent.get('/api/files/undefined');

                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors.fieldErrors).toEqual({
                    id: [expect.any(String)],
                });
            });

            it('should return 404 when the file does not exist', async () => {
                // Arrange
                await authenticate();

                // Act
                const response = await agent.get(`/api/files/${crypto.randomUUID()}`);

                // Assert
                expect(response.status).toBe(404);
                expect(response.body).toEqual({
                    message: 'No file found with this id',
                });
            });
        });
    });

    describe('DELETE /api/files/:id', () => {
        describe('success', () => {
            it('should delete the file', async () => {
                // Arrange
                await authenticate();
                await uploadTestFile();

                const infoResponse = await agent.get(`/api/folders/${folderId}`);

                // Act
                const response = await agent.delete(`/api/files/${infoResponse.body.files[0].id}`);

                // Assert
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    message: 'File deleted sucessfully',
                    id: expect.any(String),
                });

                const fileInfoAfter = await agent.get(`/api/files/${response.body.id}`);

                expect(fileInfoAfter.status).toBe(404);
                expect(fileInfoAfter.body).toEqual({
                    message: 'No file found with this id',
                });
            });
        });

        describe('failure', () => {
            it('should reject an unauthenticated request', async () => {
                // Act
                const response = await agent.delete(`/api/files/${fileId}`);

                // Assert
                expect(response.status).toBe(401);
                expect(response.body).toEqual({
                    message: 'Unauthorized',
                });
            });

            it('should reject an invalid file id', async () => {
                // Arrange
                await authenticate();

                // Act
                const response = await agent.delete('/api/files/undefined');

                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors.fieldErrors).toEqual({
                    id: [expect.any(String)],
                });
            });

            it('should return 404 when the file does not exist', async () => {
                // Arrange
                await authenticate();

                // Act
                const response = await agent.delete(`/api/files/${crypto.randomUUID()}`);

                // Assert
                expect(response.status).toBe(404);
                expect(response.body).toEqual({
                    message: 'No file with id found.',
                });
            });
        });
    });
});
