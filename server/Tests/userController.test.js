describe('signupUser', () => {
    describe('success', () => {
        beforeEach(() => {
            // Arrange:
            // - prisma.user.findUnique -> null
            // - bcrypt.hash -> hashed password
            // - prisma.$transaction -> success
        });

        it('creates a user and root folder, then returns 201', async () => {
            // Arrange
            // Act
            // Assert
            // - findUnique called with email
            // - bcrypt.hash called with password
            // - transaction called
            // - tx.user.create called
            // - tx.folder.create called
            // - status 201
            // - success message returned
        });
    });

    describe('failure', () => {
        describe('when the user already exists', () => {
            beforeEach(() => {
                // Arrange:
                // - prisma.user.findUnique -> existing user
            });

            it('returns 409 and does not continue with signup', async () => {
                // Assert
                // - status 409
                // - error message
                // - bcrypt.hash NOT called
                // - transaction NOT called
            });
        });

        describe('when checking for an existing user fails', () => {
            beforeEach(() => {
                // Arrange:
                // - prisma.user.findUnique throws
            });

            it('passes the error to next()', async () => {});
        });

        describe('when password hashing fails', () => {
            beforeEach(() => {
                // Arrange:
                // - findUnique -> null
                // - bcrypt.hash throws
            });

            it('passes the error to next()', async () => {});
        });

        describe('when the transaction fails', () => {
            beforeEach(() => {
                // Arrange:
                // - findUnique -> null
                // - bcrypt.hash succeeds
                // - transaction throws
            });

            it('passes the error to next()', async () => {});
        });
    });
});
