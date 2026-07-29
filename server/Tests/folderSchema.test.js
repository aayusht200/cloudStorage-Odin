import { describe, expect } from 'vitest';
import { createFolderSchema } from '../schema/folder';
describe('folderSchema', () => {
    const folderData = {
        folderName: 'testFolder',
        parentId: crypto.randomUUID(),
    };
    describe('folderName', () => {
        it('success on correct folderName', () => {
            expect(createFolderSchema.parse(folderData)).toEqual(folderData);
        });
        it('failure on non string folderName', () => {
            expect(createFolderSchema.safeParse({ ...folderData, folderName: 123 }).success).toBe(false);
        });
        it('failure on empty folderName', () => {
            expect(createFolderSchema.safeParse({ ...folderData, folderName: '' }).success).toBe(false);
        });
        it('trims folderName', () => {
            expect(createFolderSchema.parse({ ...folderData, folderName: `${folderData.folderName}     ` })).toEqual(
                folderData
            );
        });
    });
    describe('parentId', () => {
        it('only uuid is allowed', () => {
            expect(createFolderSchema.safeParse(folderData).success).toBe(true);
        });
        it('empty id is rejected', () => {
            expect(createFolderSchema.safeParse({ ...folderData, parentId: '' }).success).toBe(false);
        });
        it('invalid id is rejected', () => {
            expect(
                createFolderSchema.safeParse({ ...folderData, parentId: folderData.parentId + 'asdsad' }).success
            ).toBe(false);
        });
    });
});
