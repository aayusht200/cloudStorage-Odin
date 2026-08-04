const requireAuth = (req, res, next) => {
    console.log({
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
    });

    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }

    next();
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            message: 'Forbidden',
        });
    }

    next();
};

export { requireAdmin, requireAuth };
