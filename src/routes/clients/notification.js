import { Router } from 'express';
import validate from '../../middleware/validate';
import validations from '../../helpers/utils/validations/commonValidation';
import { authentication, checkPermission } from '../../middleware/auth';
import notificationController from '../../controller/client/notification';
const router = Router();

router.post('/save-device-token', authentication, checkPermission, validate(validations.deviceToken), notificationController.saveToken);
router.post('/send-notification', authentication, notificationController.sendManualPushNotification);

export default router;
