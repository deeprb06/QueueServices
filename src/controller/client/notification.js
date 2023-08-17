import notificationService from '../../services/notification';

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
        title: 'Test Notification Of Drona',
        body: 'Hello!!😃 this is the test notification Of Drona 😃',
    };
    await notificationService.sendPushNotificationToUsers({
        fcmTokens: [body.token],
        notificationPayload: notification,
    });
    return util.successResponse(null, res);
});

export default {
    saveToken,
    sendManualPushNotification,
};
