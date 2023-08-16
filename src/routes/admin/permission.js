import { Router } from 'express';
import { authentication, checkPermission } from '../../middleware/auth';
import validate from '../../middleware/validate';
import validations from '../../helpers/utils/validations/commonValidation';
import rolePermissionController from '../../controller/rolePermissionController';
const router = Router();

router.post('/get', authentication, checkPermission, rolePermissionController.getPermission);
router.post('/update', validate(validations.updatePermission), authentication, checkPermission, rolePermissionController.updatePermission);
router.post('/list', authentication, checkPermission, rolePermissionController.getAllPermission);
router.post('/by-role/:id', authentication, checkPermission, rolePermissionController.getByRole);

export default router;
