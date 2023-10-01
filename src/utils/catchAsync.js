const { RESPONSE_CODE } = require('../config/constants/common');
const responseCode = require('./responceCode');

const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        res.status(responseCode.validationError).json({
            code: RESPONSE_CODE.ERROR,
            message: _localize(err.message, req),
        });
    });
};

module.exports = catchAsync;
