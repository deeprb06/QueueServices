import { Router } from 'express';
import validate from '../../middleware/validate';
import { authentication } from '../../middleware/auth';
import validations from '../../helpers/utils/validations/commonValidation';

const router = Router();

const authController = require('../../controllers/admin/authController');

router.post('/login', validate(validations.login), authController.login);
router.post('/logout', authentication, authController.logout);
router.post('/refresh-token', authentication, authController.renewToken);
router.post(
    '/forgot-password',
    validate(validations.forgetpassword),
    authController.forgetPassword,
);
router.post(
    '/verify-password',
    validate(validations.resetpassword),
    authController.verifyPassword,
);
router.put(
    '/reset-password',
    validate(validations.resetpassword),
    authController.resetpassword,
);

router.post(
    '/verify-login-otp',
    validate(validations.verifyLoginOtp),
    authController.verifyLoginOtp,
);
router.post(
    '/resend-login-otp',
    validate(validations.resendLoginOtp),
    authController.resendLoginOtp,
);

router.put(
    '/change-password',
    validate(validations.changePassword),
    authentication,
    authController.changePassword,
);

export default router;
