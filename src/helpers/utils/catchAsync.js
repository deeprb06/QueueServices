import httpStatus from 'http-status';
import { RESPONSE_CODE } from '../../config/common';
const responseCode = require('../utils/responceCode');

export const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
        console.error(err);
        console.error(err.message);
        logger.error(err.message);
        res.status(responseCode.validationError).json({
            code: RESPONSE_CODE.ERROR,
            message: _localize(err.message, req),
        });
    })
}
