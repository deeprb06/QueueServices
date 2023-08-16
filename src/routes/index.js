import { Router } from 'express';
const router = Router();

router.use('/admin', require('./admin/index'));

export default router;
