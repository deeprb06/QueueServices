import { Router } from 'express';
const router = Router();

router.use('/admin', require('./admin/index'));
router.use('/client', require('./clients/index'));

export default router;
