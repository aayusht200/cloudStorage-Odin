/* v8 ignore file -- integration fixture helper */
import request from 'supertest';
import { app } from '../../app.js';
import prisma from '../../config/Connection.js';
import { deleteFile } from '../../service/storage.js';

const makeTestUserPayload = (overrides = {}) => ({
    email: `test-${crypto.randomUUID()}@gmail.com`,
    password: 'Test@123',
    firstName: 'Test',
    lastName: 'User',
    ...overrides,
});

const createTestUser = async (overrides = {}) => {
    const payload = makeTestUserPayload(overrides);
    const response = await request(app).post('/api/users/signup').send(payload);

    if (response.status !== 201) {
        throw new Error(`Unable to create test user ${payload.email}: ${response.status}`);
    }

    return payload;
};

const createAuthenticatedAgent = async (overrides = {}) => {
    const payload = await createTestUser(overrides);
    const agent = request.agent(app);
    const loginResponse = await agent.post('/api/users/login').send({
        email: payload.email,
        password: payload.password,
    });

    if (loginResponse.status !== 200) {
        throw new Error(`Unable to login test user ${payload.email}: ${loginResponse.status}`);
    }

    const userResponse = await agent.get('/api/users/me');

    if (userResponse.status !== 200) {
        throw new Error(`Unable to load test user ${payload.email}: ${userResponse.status}`);
    }
    return {
        agent,
        payload,
        user: userResponse.body,
        rootFolderId: userResponse.body.rootFolderId,
        csrfToken: userResponse.body.csrfToken,
    };
};

const cleanupTestUsers = async (emails) => {
    for (const email of emails) {
        const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });

        if (!user) continue;

        const files = await prisma.file.findMany({ where: { userId: user.id }, select: { storageName: true } });

        for (const file of files) {
            try {
                await deleteFile(file.storageName);
            } catch {
                // Continue database cleanup even if the object is already gone.
            }
        }

        await prisma.file.deleteMany({ where: { userId: user.id } });
        await prisma.folder.deleteMany({ where: { userId: user.id, parentId: { not: null } } });
        await prisma.folder.deleteMany({ where: { userId: user.id } });
        await prisma.user.deleteMany({ where: { id: user.id } });
    }
};

export { cleanupTestUsers, createAuthenticatedAgent, createTestUser, makeTestUserPayload };
