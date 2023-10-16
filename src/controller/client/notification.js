const notificationService = require('../../services/notification');

const saveToken = catchAsync(async (req, res) => {
    const body = { ...req.body };
    const user = req.user;
    body.userId = user._id;
    await notificationService.createOrUpdateToken(body);
    res.message = _localize('module.tokenUpdated', req);
    return util.successResponse(null, res);
});

const sendManualPushNotification = catchAsync(async (req, res) => {
    const body = req.body;
    const notification = {
        title: 'Test Notification',
        body: 'Hello!!😃 this is the test notification Of queue 😃',
    };
    await notificationService.sendPushNotificationToUsers({
        fcmTokens: [body.token],
        notificationPayload: notification,
    });
    return util.successResponse(null, res);
});

const list = catchAsync(async (req, res) => {
    const result = await notificationService.listAll(req);
    if (result) {
        res.message = _localize('module.findAll', req, 'Notification');
        return util.successResponse(result, res);
    }
    return util.failureResponse(
        _localize('module.findAllFailed', req, 'Notification'),
    );
});

const updateReadStatus = catchAsync(async (req, res) => {
    const result = await notificationService.updateReadStatus(req);
    const messageKey = result.isRead ? 'module.active' : 'module.deactive';
    res.message = _localize(messageKey, res);
    return util.successResponse(result, res);
});

const notificationCount = catchAsync(async (req, res) => {
    const result = await notificationService.notificationCount(req);
    res.message = _localize('module.get', req, 'Notification count');
    return util.successResponse(result, res);
});

module.exports = {
    saveToken,
    sendManualPushNotification,
    list,
    updateReadStatus,
    notificationCount,
};
