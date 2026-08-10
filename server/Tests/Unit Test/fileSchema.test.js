import { Buffer } from 'node:buffer';
import { describe, expect, it } from 'vitest';
import { createFileSchema, idSchema } from '../../schema/file';
describe('fileSchema', () => {
    const validFile = {
        originalname: 'demoFile',
        mimetype: 'image/jpeg',
        size: 485760,
        buffer: Buffer.from('hello world!'),
    };

    describe('originalname', () => {
        it('accepts a valid filename', () => {
            expect(createFileSchema.safeParse({ ...validFile, originalname: 'sampleName' }).success).toBe(true);
        });
        it('rejects empty filename', () => {
            expect(createFileSchema.safeParse({ ...validFile, originalname: '' }).success).toBe(false);
        });
        it('rejects non-string filename', () => {
            expect(createFileSchema.safeParse({ ...validFile, originalname: 123 }).success).toBe(false);
        });
    });

    describe('mimetype', () => {
        it('accepts a supported mime type', () => {
            expect(createFileSchema.safeParse({ ...validFile, mimetype: 'image/png' }).success).toBe(true);
        });
        it('rejects unsupported mime type', () => {
            expect(createFileSchema.safeParse({ ...validFile, mimetype: 'application/docx' }).success).toBe(false);
        });
        it('rejects empty mime type', () => {
            expect(createFileSchema.safeParse({ ...validFile, mimetype: '' }).success).toBe(false);
        });
        it('rejects non-string mime type', () => {
            expect(createFileSchema.safeParse({ ...validFile, mimetype: 1234 }).success).toBe(false);
        });
    });

    describe('size', () => {
        it('accepts file size of 0 bytes', () => {
            expect(createFileSchema.safeParse({ ...validFile, size: 0 }).success).toBe(true);
        });
        it('accepts maximum file size', () => {
            expect(createFileSchema.safeParse({ ...validFile, size: 1048576 }).success).toBe(true);
        });
        it('rejects file larger than 10 MB', () => {
            expect(createFileSchema.safeParse({ ...validFile, size: 10485761 }).success).toBe(false);
        });
        it('rejects non-numeric size', () => {
            expect(createFileSchema.safeParse({ ...validFile, size: '10485761' }).success).toBe(false);
        });
    });

    describe('buffer', () => {
        it('accepts a Buffer instance', () => {
            expect(createFileSchema.safeParse({ ...validFile, buffer: Buffer.from('hello') }).success).toBe(true);
        });
        it('rejects non-buffer values', () => {
            expect(createFileSchema.safeParse({ ...validFile, buffer: '10485761' }).success).toBe(false);
        });
    });

    describe('full object validation', () => {
        it('accepts a valid file object', () => {
            expect(createFileSchema.safeParse(validFile).success).toBe(true);
        });
        it('returns parsed data', () => {
            expect(createFileSchema.parse(validFile)).toEqual(validFile);
        });
    });
});

describe('idSchema', () => {
    const id = { id: crypto.randomUUID() };
    it('only uuid is allowed', () => {
        expect(idSchema.safeParse(id).success).toBe(true);
    });
    it('empty id is rejected', () => {
        expect(idSchema.safeParse({ id: '' }).success).toBe(false);
    });
    it('invalid id is rejected', () => {
        expect(idSchema.safeParse({ id: id + id }).success).toBe(false);
    });
});
