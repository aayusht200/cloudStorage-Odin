import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../app.js';
describe('File routes', () => {
    let agent;
    let userPayload;
    let folderId;
    let filePath;
    let fileId;

    beforeEach(() => {
        agent = request.agent(app);
        folderId = '4b800afd-8113-4f9b-a963-9a42f5f215cd';
        userPayload = {
            email: 'testuser@gmail.com',
            password: 'Test@123',
        };
        filePath = '/Users/aayushtrivedi/Downloads/cloudStorage-Odin/screenshot/emptyDrive.png';
        fileId = '09d8732b-f86d-4f61-b50f-9d88caf76110';
    });

    describe('POST /api/files/create', () => {
        describe('success', () => {
            it('should upload a file', async () => {
                // Arrange
                // Login using agent
                await agent.post('/api/users/login').send(userPayload);
                // Create/identify a valid folder
                // Act
                // Send multipart request with file
                const createResponse = await agent
                    .post('/api/files/create')
                    .field('folderId', folderId)
                    .attach('file', filePath);
                // Assert
                expect(createResponse.status).toBe(201);
                expect(createResponse.body).toEqual({ message: 'File uploaded sucessfully' });
            });
        });

        describe('failure', () => {
            it('should reject an unauthenticated request', async () => {
                // Act
                const createResponse = await agent.post('/api/files/create');

                // .field('folderId', folderId)
                // .attach('file', filePath);
                // Avoid multipart body here due to EPIPE with Vitest/Supertest.

                // Assert
                expect(createResponse.status).toBe(401);
                expect(createResponse.body).toEqual({
                    message: 'Unauthorized',
                });
            });

            it('should reject a request without a file', async () => {
                // Arrange
                // Login using agent
                await agent.post('/api/users/login').send(userPayload);
                // Create/identify a valid folder
                // Act
                // Send multipart request with file
                const createResponse = await agent.post('/api/files/create').field('folderId', folderId);
                // Assert
                expect(createResponse.status).toBe(400);
                expect(createResponse.body.errors.formErrors).toEqual([expect.any(String)]);
            });

            it('should reject invalid file input', async () => {
                // Arrange
                // Login using agent
                await agent.post('/api/users/login').send(userPayload);
                // Create/identify a valid folder
                // Act
                // Send multipart request with file
                const createResponse = await agent
                    .post('/api/files/create')
                    .field('folderId', folderId)
                    .attach('file', '/Users/aayushtrivedi/Downloads/cloudStorage-Odin/screenshot/Test.mov');
                // Assert
                expect(createResponse.status).toBe(500);
                expect(createResponse.body).toEqual({ message: 'Invalid file type' });
            });

            it('should reject an invalid folder id', async () => {
                // Arrange
                // Login using agent
                await agent.post('/api/users/login').send(userPayload);
                // Create/identify a valid folder
                // Act
                // Send multipart request with file
                const createResponse = await agent
                    .post('/api/files/create')
                    .field('folderId', crypto.randomUUID())
                    .attach('file', filePath);
                // Assert
                expect(createResponse.status).toBe(400);
                expect(createResponse.body).toEqual({ message: 'Invalid folder Id' });
            });
        });
    });

    describe('GET /api/files/:id', () => {
        describe('success', () => {
            it('should return the file', async () => {
                // Arrange
                // Login using agent
                await agent.post('/api/users/login').send(userPayload);
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
                // Login using agent
                await agent.post('/api/users/login').send(userPayload);
                // Act
                const response = await agent.get(`/api/files/undefined`);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors.fieldErrors).toEqual({ id: [expect.any(String)] });
            });

            it('should return 404 when the file does not exist', async () => {
                // Arrange
                // Login using agent
                await agent.post('/api/users/login').send(userPayload);
                // Act
                const response = await agent.get(`/api/files/${crypto.randomUUID()}`);
                // Assert
                expect(response.status).toBe(404);
                expect(response.body).toEqual({ message: 'No file found with this id' });
            });
        });
    });

    describe('DELETE /api/files/:id', () => {
        describe('success', () => {
            it('should delete the file', async () => {
                // Arrange
                // Login using agent
                await agent.post('/api/users/login').send(userPayload);
                await agent.post('/api/files/create').field('folderId', folderId).attach('file', filePath);
                const infoResponse = await agent.get(`/api/folders/${folderId}`);
                // Act
                const response = await agent.delete(`/api/files/${infoResponse.body.files[0].id}`);
                // Assert
                expect(response.status).toBe(200);
                expect(response.body).toEqual({ message: 'File deleted sucessfully', id: expect.any(String) });
                const fileInfoAfter = await agent.get(`/api/files/${response.body.id}`);
                expect(fileInfoAfter.status).toBe(404);
                expect(fileInfoAfter.body).toEqual({ message: 'No file found with this id' });
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
                // Login using agent
                await agent.post('/api/users/login').send(userPayload);
                // Act
                const response = await agent.delete(`/api/files/undefined`);
                // Assert
                expect(response.status).toBe(400);
                expect(response.body.errors.fieldErrors).toEqual({ id: [expect.any(String)] });
            });

            it('should return 404 when the file does not exist', async () => {
                // Arrange
                // Login using agent
                await agent.post('/api/users/login').send(userPayload);
                // Act
                const response = await agent.delete(`/api/files/${crypto.randomUUID()}`);
                // Assert
                expect(response.status).toBe(404);
                expect(response.body).toEqual({ message: 'No file with id found.' });
            });
        });
    });
});
