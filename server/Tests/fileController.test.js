import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createFile } from '../controller/fileController';

describe('createFile', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {},
            file: undefined,
            user: {
                id: '',
            },
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
        };

        next = vi.fn();
    });

    describe('when no file is uploaded', () => {
        it('should return 400', async () => {
            // Arrange
            // Act
            // Assert
        });
    });

    describe('when the folder does not belong to the user', () => {
        it('should return 400', async () => {
            // Arrange
            // Act
            // Assert
        });
    });

    describe('when the file is uploaded successfully', () => {
        it('should upload the file and create the database record', async () => {
            // Arrange
            // Act
            // Assert
        });
    });

    describe('when uploading the file fails', () => {
        it('should pass the error to next', async () => {
            // Arrange
            // Act
            // Assert
        });
    });

    describe('when creating the database record fails', () => {
        it('should pass the error to next', async () => {
            // Arrange
            // Act
            // Assert
        });
    });
});
