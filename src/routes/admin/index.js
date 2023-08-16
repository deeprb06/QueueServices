import { Router } from 'express';

const router = Router();

router.use('/auth', require('./auth'));
router.use('/permissions', require('./permission'));
router.use('/roles', require('./role'));
router.use('/users', require('./user'));

export default router;
