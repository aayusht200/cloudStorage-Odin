export const csrfVerification = (req, res, next) => {
    if (req.session.csrfToken !== req.headers['x-csrf-token']) {
        return res.status(403).json({
            message: 'Invalid CSRF token',
        });
    }
    next();
};
