import util from '../helpers/utils/messages';

const validate = (validator) => {
    return async function (req, res, next) {
        try {
            req.body = await validator.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (err) {
            if (err.isJoi) return util.inValidParam(`${err.message}.`, res);
            next(util.failureResponse(`${err.message}.`, res));
        }
    };
};

export default validate;
