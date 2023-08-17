import { Router } from 'express';
const router = Router();

router.use('/notification', require('./notification'));

export default router;
