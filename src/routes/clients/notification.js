const router = require('express').Router();
const notificationController = require('../../controller/client/notification');

router.post(
    '/general/list',
    authentication,
    checkPermission,
    notificationController.list,
);
router.patch(
    '/read-notification/:id',
    authentication,
    checkPermission,
    notificationController.updateReadStatus,
);
router.put(
    '/general/count',
    authentication,
    checkPermission,
    notificationController.notificationCount,
);


module.exports = router;
