export const validateCheck = (schema) => (req, res, next) => {
    let bodyData = req.body;
    const { error } = schema.validate(bodyData);
    if (error) {
        return res.status(500).send({ status: 500, message: error.details[0].message });
    }
    next();
};