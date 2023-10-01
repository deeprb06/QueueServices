const { Router } = require('express');
const router = Router();

router.use('/admin', require('./admin/index'));
router.use('/client', require('./clients/index'));

module.exports = router;
