export const validate = (schema, target = 'body') => {
    return (req, res, next) => {
        const result = schema.safeParse(req[target]);
        if (!result.success) {
            return res.status(400).json({
                errors: result.error.flatten(),
            });
        }

        req[target] = result.data;
        next();
    };
};
