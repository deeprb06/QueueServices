import { success, badRequest, unAuthorizedRequest, create, internalServerError, notFound, validationError } from '../utils/responceCode';
import { RESPONSE_CODE } from '../../config/common';

export const unAuthenticated = (res) => {
    return res.status(unAuthorizedRequest).json({
      code: RESPONSE_CODE.ERROR,
      message: res.message,
      data: {},
    });
};

export const successResponse = (data, res) => {
    return res.status(success).json({
      code: RESPONSE_CODE.DEFAULT,
      message: res.message,
      data: data,
    });
};

export const failedSoftDelete = (res) => {
    res.MESSAGE = "Data can not be soft delete due to internal server error";
    return res.status(internalServerError).json({
      STATUS: 'FAILURE',
      MESSAGE: "Data can not be soft delete due to internal server error",
      DATA: {}
    });
}

export const createdDocumentResponse = (data, res) => {
    return res.status(create).json({
      code: RESPONSE_CODE.DEFAULT,
      message: res.message,
      data: data,
    });
};

export const emailSendSuccessfully = (res) => {
    return res.status(success).json({
      code: RESPONSE_CODE.DEFAULT,
      message: res.message,
      data: {},
    });
};

export const sendEmailFailed = (res) => {
    return res.status(success).json({
      code: RESPONSE_CODE.ERROR,
      message: res.message,
      data: {},
    });
};

export const emailVerifySuccess = (res) => {
    return res.status(success).json({
      CODE: RESPONSE_CODE.DEFAULT,
      MESSAGE: res.message,
      data: {},
    });
};

export const changePasswordResponse = (res) => {
    return res.status(success).json({
      code: RESPONSE_CODE.DEFAULT,
      message: res.message,
      data: {},
    });
};

export const wrongPassword = (res) => {
    return res.status(validationError).json({
      code: RESPONSE_CODE.ERROR,
      message: res.message,
      data: {},
    });
};

export const updateProfileResponse = (data, res) => {
    return res.status(success).json({
      code: RESPONSE_CODE.DEFAULT,
      message: res.message,
      data: data,
    });
};

export const failureResponse = (data, res) => {
    let i = 0;
    if (data && data.name === "ValidationError") {
      Object.keys(data.errors).forEach((key) => {
        if (i !== 1) {
          data.message = data.errors[key].message;
        }
        i++;
      });
    }
    res.message = (data && data.message) ? data.message : (res.message ? res.message : data);
    return res.status(validationError).json({
      code: RESPONSE_CODE.ERROR,
      message: res.message,
    });
};

export const badRequest = (data, res) => {
    return res.status(validationError).json({
      code: RESPONSE_CODE.ERROR,
      message: res.message,
      data: data,
    });
};

export const recordNotFound = (data, res) => {
    return res.status(validationError).json({
      code: RESPONSE_CODE.DEFAULT,
      message: res.message,
      data: {},
    });
};

export const insufficientParameters = (res) => {
    return res.status(badRequest).json({
      code: RESPONSE_CODE.ERROR,
      message: res.message,
      data: {},
    });
};

export const notFound = (err, res) => {
    return res.status(notFound).json({
      code: RESPONSE_CODE.DEFAULT,
      message: err,
      data: {},
    });
};

export const inValidParam = (message, res) => {
    message = message ? message.replace(/"/g, "") : message;
    res.message = message;
    return res.status(validationError).json({
      code: RESPONSE_CODE.ERROR,
      message: message,
      data: {},
    });
};

export const unAuthorizedRequest = (message, res) => {
    return res.status(unAuthorizedRequest).json({
      code: RESPONSE_CODE.ERROR,
      message: err,
      data: {},
    });
};

export const verificationOTP = (result, res) => {
    return res.status(success).json({
      code: RESPONSE_CODE.OTP,
      message: res.message,
      data: result.token ? result : { message: result },
    });
};

export const passwordEmailWrong = (res) => {
    return res.status(unAuthorizedRequest).json({
      code: RESPONSE_CODE.ERROR,
      message: res.message,
      data: {},
    });
};

export const passwordNotSet = (res) => {
    return res.status(unAuthorizedRequest).json({
      code: RESPONSE_CODE.ERROR,
      message: res.message,
      data: {},
    });
};

export const loginFailed = (error, res) => {
    res.message = error.message;
    return res.status(validationError).json({
      code: RESPONSE_CODE.ERROR,
      message: error.message,
      data: {},
    });
};

export const userNotFound = (res) => {
    return res.status(validationError).json({
      code: RESPONSE_CODE.ERROR,
      message: res.message,
      data: {},
    });
};

export const logoutSuccessfull = (result, res) => {
    return res.status(success).json({
      code: RESPONSE_CODE.DEFAULT,
      message: res.message,
      data: result,
    });
};

export const changePasswordFailResponse = (res) => {
    return res.status(validationError).json({
      code: RESPONSE_CODE.ERROR,
      message: res.message,
    });
};

export const loginOtpVerified = (data, res) => {
    return res.status(success).json({
      code: RESPONSE_CODE.OTP,
      message: res.message,
      data: data,
    });
};

export const loginOtpVerificationFailed = (data, res) => {
    return res.status(validationError).json({
      code: RESPONSE_CODE.ERROR,
      message: res.message,
      data: data,
    });
};

export const successListResponse = (result, res) => {
    return res.status(success).json({
      CODE: RESPONSE_CODE.DEFAULT,
      MESSAGE: result.message,
      DATA: result.data,
      PAGINATOR: result.paginator,
    });
};

export const loginApiUserFailed = (res) => {
    return res.status(badRequest).json({
      code: RESPONSE_CODE.ERROR,
      message: res.message,
      data: {},
    });
};
  