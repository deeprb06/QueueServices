import { Router } from 'express';
import validate from "../../middleware/validate";
import validations from "../../helpers/utils/validations/commonValidation";
import { authentication, checkPermission } from "../../middleware/auth";
import roleController from '../../controller/admin/roleController';

const router = Router()

router.post('/list', authentication, checkPermission, roleController.findAllRole);
router.post('/create', validate(validations.roleCreate), authentication, checkPermission, roleController.create);
router.put('/update/:id', validate(validations.roleUpdate), authentication, checkPermission, roleController.update);
router.delete('/delete/:id', authentication, checkPermission, roleController.deleteRole);
router.get('/:id', authentication, checkPermission, roleController.getRole);
router.put('/partially-update/:id', authentication, checkPermission, roleController.partiallyUpdate);

export default router;
