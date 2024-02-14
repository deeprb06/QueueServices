const authService = require('../../services/auth');
const { JWT } = require('../../../config/constants/authConstant');
const { MESSAGE } = require(`../../../config/message`);

const login = catchAsync(async (req, res) => {
    let { email } = req.body;
    email = email.toLowerCase();
    let result = await authService.loginDeviceUser(email, req);
    if (result && result.success) {
        req.userId = result.id;
        res.message = _localize('auth.loginSuccess', req);
        return util.loginSuccess(result.data, res);
    } else {
        res.message = _localize('auth.account_not_found_email', req);
        return util.passwordEmailWrong(res);
    }
});

const resendLoginOtp = catchAsync(async (req, res) => {
    const body = req.body;
    let url = req.originalUrl;
    await authService
        .resendLoginOtp(body, url)
        .then((result) => {
            res.message = _localize('auth.resend_otp_success', req);
            return util.successResponse(
                MESSAGE.LOGIN_VIA_OTP_RESEND.message,
                res,
            );
        })
        .catch((err) => {
            return util.failureResponse(
                {
                    message: err,
                },
                res,
            );
        });
});

const logout = catchAsync(async (req, res) => {
    const tokenData = req.body;
    let result = await authService.logoutService(
        req.headers.authorization,
        tokenData,
    );
    if (result) {
        res.message = _localize('auth.logoutSuccess', req);
        return util.logoutSuccessfull({}, res);
    } else {
        util.failureResponse(_localize('auth.logoutFaild', req), res);
    }
});
const renewToken = catchAsync(async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        util.unAuthorizedRequest(
            _localize('response_message.unAuthenticated', req),
            res,
        );
    }
    let result = await authService.refreshTokenService({ req });
    if (result) {
        res.message = _localize('response_message.renew_token', req);
        util.successResponse(result, res);
    } else {
        util.failureResponse(
            _localize('response_message.unAuthenticated', req),
            res,
        );
    }
});

const verifyPassword = catchAsync(async (req, res) => {
    let email = req.body.email;
    let token = req.body.token;
    if (token && email) {
        let verify = await authService.resetPasswordValidationService(
            email,
            token,
        );
        if (verify) {
            res.message = _localize('auth.valid_token', req);
            util.successResponse(token, res);
        } else {
            res.message = _localize('auth.invalid_link', req);
            util.linkInvalid(res);
        }
    } else {
        res.message = _localize('auth.invalid_link', req);
        util.linkInvalid(res);
    }
});
const forgetPassword = catchAsync(async (req, res) => {
    let result = await authService.forgetPasswordService(req.body.email);
    if (result) {
        res.message = _localize('auth.email_sent', req);
        util.emailSendSuccessfully(res);
    } else {
        res.message = _localize('auth.account_not_found_email', req);
        util.userNotFound(res);
    }
});
const resetpassword = catchAsync(async (req, res) => {
    let otp = req.body.code;
    let email = req.body.email;
    let password = req.body.password;
    let result = await authService.resetPasswordService(
        password,
        otp,
        email,
        req.i18n,
    );
    if (result.flag) {
        res.message = _localize('auth.change_password', req);
        return util.changePasswordResponse(res);
    }
    res.message = result.data;
    return util.changePasswordFailResponse(res);
});
const changePassword = catchAsync(async (req, res) => {
    let password = req.body.password;
    let newPassword = req.body.newPassword;
    let result = await authService.changePasswordService(
        req.userId,
        password,
        newPassword,
    );
    if (result === JWT.CHANGE_PASSWORD_SUCCESS) {
        res.message = _localize('auth.change_password', req);
        util.changePasswordResponse(res);
    } else if (result === JWT.PASSWORD_USE_ERROR) {
        res.message = _localize('auth.password_error', req);
        util.changePasswordFailResponse(res);
    } else {
        res.message = _localize('auth.current_password_wrong', req);
        util.wrongPassword(res);
    }
});
const verifyLoginOtp = catchAsync(async (req, res) => {
    const email = req.body.email;
    const code = req.body.code;
    const result = await authService.verifyLoginOtpService({
        email,
        code,
        i18n: req.i18n,
    });
    if (result.flag) {
        res.message = _localize('auth.login_otp_verify_success', req);
        return util.loginOtpVerified(result.data, res);
    }
    res.message = result.data;
    return util.loginOtpVerificationFailed(result.data, res);
});

const checkEmailExist = catchAsync(async (req, res) => {
    res.message = _localize('auth.emailValidate', req);
    const result = await authService.checkEmailOrRegister(
        req.user,
        req.roleCode,
    );
    return util.successResponse(result, res);
});
const registerUser = catchAsync(async (req, res) => {
    const data = { ...req.body };
    res.message = _localize('auth.register', req);
    const result = await authService.register(data, req);
    return util.successResponse(result, res);
});

const guestLogin = catchAsync(async (req, res) => {
    const data = { ...req.body };
    res.message = _localize('auth.guestLogin', req);
    const result = await authService.attemptGuestLogin(data);
    return util.successResponse(result, res);
});

const updateProfile = catchAsync(async (req, res) => {
    const data = { ...req.body };
    const user = req.user;
    res.message = _localize('module.update', req, 'profile');
    const result = await authService.updateProfile(data, user);
    return util.successResponse(_.omit(result, ['tokens']), res);
});

const getProfile = catchAsync(async (req, res) => {
    const user = req.user;
    res.message = _localize('module.retrieve', req, 'profile');
    const result = await authService.getProfile(user);
    return util.successResponse(_.omit(result, ['tokens']), res);
});

module.exports = {
    login,
    logout,
    renewToken,
    forgetPassword,
    verifyPassword,
    resetpassword,
    verifyLoginOtp,
    changePassword,
    resendLoginOtp,
    checkEmailExist,
    updateProfile,
    getProfile,
    guestLogin,
    registerUser,
};
