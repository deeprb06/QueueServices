import { success, badRequest, unAuthorizedRequest, create, internalServerError, notFound, validationError } from '../utils/responceCode';
import { RESPONSE_CODE } from '../../config/common';

const unAuthenticated = (res) => {
    return res.status(unAuthorizedRequest).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: {},
    });
};

const successResponse = (data, res) => {
    return res.status(success).json({
        code: RESPONSE_CODE.DEFAULT,
        message: res.message,
        data: data,
    });
};

const failedSoftDelete = (res) => {
    res.MESSAGE = 'Data can not be soft delete due to internal server error';
    return res.status(internalServerError).json({
        STATUS: 'FAILURE',
        MESSAGE: 'Data can not be soft delete due to internal server error',
        DATA: {},
    });
};

const createdDocumentResponse = (data, res) => {
    return res.status(create).json({
        code: RESPONSE_CODE.DEFAULT,
        message: res.message,
        data: data,
    });
};

const emailSendSuccessfully = (res) => {
    return res.status(success).json({
        code: RESPONSE_CODE.DEFAULT,
        message: res.message,
        data: {},
    });
};

const sendEmailFailed = (res) => {
    return res.status(success).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: {},
    });
};

const emailVerifySuccess = (res) => {
    return res.status(success).json({
        CODE: RESPONSE_CODE.DEFAULT,
        MESSAGE: res.message,
        data: {},
    });
};

const changePasswordResponse = (res) => {
    return res.status(success).json({
        code: RESPONSE_CODE.DEFAULT,
        message: res.message,
        data: {},
    });
};

const wrongPassword = (res) => {
    return res.status(validationError).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: {},
    });
};

const updateProfileResponse = (data, res) => {
    return res.status(success).json({
        code: RESPONSE_CODE.DEFAULT,
        message: res.message,
        data: data,
    });
};

const failureResponse = (data, res) => {
    let i = 0;
    if (data && data.name === 'ValidationError') {
        Object.keys(data.errors).forEach((key) => {
            if (i !== 1) {
                data.message = data.errors[key].message;
            }
            i++;
        });
    }
    res.message =
        data && data.message ? data.message : res.message ? res.message : data;
    return res.status(validationError).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
    });
};

const badRequest = (data, res) => {
    return res.status(validationError).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: data,
    });
};

const recordNotFound = (data, res) => {
    return res.status(validationError).json({
        code: RESPONSE_CODE.DEFAULT,
        message: res.message,
        data: {},
    });
};

const insufficientParameters = (res) => {
    return res.status(badRequest).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: {},
    });
};

const notFound = (err, res) => {
    return res.status(notFound).json({
        code: RESPONSE_CODE.DEFAULT,
        message: err,
        data: {},
    });
};

const inValidParam = (message, res) => {
    message = message ? message.replace(/"/g, '') : message;
    res.message = message;
    return res.status(validationError).json({
        code: RESPONSE_CODE.ERROR,
        message: message,
        data: {},
    });
};

const unAuthorizedRequest = (message, res) => {
    return res.status(unAuthorizedRequest).json({
        code: RESPONSE_CODE.ERROR,
        message: err,
        data: {},
    });
};

const verificationOTP = (result, res) => {
    return res.status(success).json({
        code: RESPONSE_CODE.OTP,
        message: res.message,
        data: result.token ? result : { message: result },
    });
};

const passwordEmailWrong = (res) => {
    return res.status(unAuthorizedRequest).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: {},
    });
};

const passwordNotSet = (res) => {
    return res.status(unAuthorizedRequest).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: {},
    });
};

const loginFailed = (error, res) => {
    res.message = error.message;
    return res.status(validationError).json({
        code: RESPONSE_CODE.ERROR,
        message: error.message,
        data: {},
    });
};

const userNotFound = (res) => {
    return res.status(validationError).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: {},
    });
};

const logoutSuccessfull = (result, res) => {
    return res.status(success).json({
        code: RESPONSE_CODE.DEFAULT,
        message: res.message,
        data: result,
    });
};

const changePasswordFailResponse = (res) => {
    return res.status(validationError).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
    });
};

const loginOtpVerified = (data, res) => {
    return res.status(success).json({
        code: RESPONSE_CODE.OTP,
        message: res.message,
        data: data,
    });
};

const loginOtpVerificationFailed = (data, res) => {
    return res.status(validationError).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: data,
    });
};

const successListResponse = (result, res) => {
    return res.status(success).json({
        CODE: RESPONSE_CODE.DEFAULT,
        MESSAGE: result.message,
        DATA: result.data,
        PAGINATOR: result.paginator,
    });
};

const loginApiUserFailed = (res) => {
    return res.status(badRequest).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: {},
    });
};
  
export default {
    unAuthenticated,
    successResponse,
    failedSoftDelete,
    createdDocumentResponse,
    sendEmailFailed,
    emailSendSuccessfully,
    emailVerifySuccess,
    changePasswordResponse,
    wrongPassword,
    updateProfileResponse,
    failureResponse,
    badRequest,
    insufficientParameters,
    notFound,
    inValidParam,
    unAuthorizedRequest,
    verificationOTP,
    passwordEmailWrong,
    passwordNotSet,
    loginFailed,
    passwordEmailWrong,
    passwordNotSet,
    userNotFound,
    logoutSuccessfull,
    changePasswordFailResponse,
    loginOtpVerified,
    loginOtpVerificationFailed,
    successListResponse,
    loginApiUserFailed,
};