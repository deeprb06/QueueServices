const express = require('express');
const routes = express.Router();
const authController = require('../../controllers/client/authController');
const { authentication } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validations = require('../../utils/validations/device/auth/auth');
// routes.post("/login", validate(validations.login), authController.login);
routes.post(
    '/guest-login',
    validate(validations.guestLogin),
    authController.guestLogin,
);
routes.post('/check-email', authentication, authController.checkEmailExist);
routes.post(
    '/register',
    authentication,
    validate(validations.registerUser),
    authController.registerUser,
);
routes.post('/logout', authentication, authController.logout);
routes.post('/refresh-token', authentication, authController.renewToken);
routes.post(
    '/forgot-password',
    validate(validations.forgetpassword),
    authController.forgetPassword,
);
routes.post(
    '/verify-password',
    validate(validations.resetpassword),
    authController.verifyPassword,
);
routes.post(
    '/reset-password',
    validate(validations.resetpassword),
    authController.resetpassword,
);
routes.post(
    '/verify-login-otp',
    validate(validations.verifyLoginOtp),
    authController.verifyLoginOtp,
);
routes.post(
    '/resend-login-otp',
    validate(validations.resendLoginOtp),
    authController.resendLoginOtp,
);

routes.post(
    '/change-password',
    validate(validations.changePassword),
    authentication,
    authController.changePassword,
);

routes.post(
    '/update-profile',
    validate(validations.updateProfile),
    authentication,
    authController.updateProfile,
);
routes.get('/get-profile', authentication, authController.getProfile);

module.exports = routes;
