import { Router } from 'express';
import { authentication, checkPermission } from '../../middleware/auth';
import validate from '../../middleware/validate';
import validations from '../../helpers/utils/validations/commonValidation';
import userController from '../../controller/userController';

const router = Router();

router.post('/create', authentication, checkPermission, userController.addUser)
router.post('/list', authentication, checkPermission, userController.findAllUser)
router.get('/export-list', userController.exportUsers)
router.get('/profile', authentication, checkPermission, userController.getUser);
router.put('/update/:id', validate(validations.schemaKeys), authentication, checkPermission, userController.updateUser)
router.put('/partially-update/:id', authentication, checkPermission, userController.partiallyUpdate)
router.delete('/delete/:id', authentication, checkPermission, userController.deleteUser)

export default router;
