const NotificationList = require('../models/notificationList');
const dbServices = require('../utils/dbservices');

const listAll = async (req) => {
    try {
        return dbServices.getAllDocuments(
            NotificationList,
            req.body?.query ?? {},
            req.body?.options ?? {},
        );
    } catch (error) {
        logger.error('Error - list notification ', error);
        throw new Error(error);
    }
};

const sendPushNotification = async (fcmTokens, notificationPayload) => {
    try {
        const jsonData = {
            notification: notificationPayload,
            registration_ids: fcmTokens,
        };
        const result = await superagent
            .post(FIREBASE.NOTIFICATION_LINK)
            .send(jsonData)
            .set('Authorization', 'key=' + FIREBASE.SERVERKEY)
            .set('Content-Type', 'application/json');
        return result;
    } catch (error) {
        logger.error('Error - sendPushNotification', error);
    }
};

const sendPushNotificationToUsers = async (data) => {
    data.fcmTokens.forEach(async (fcmToken) => {
        const notificationObj = {
            message: {
                token: fcmToken,
                notification: data.notificationPayload,
                data: {},
            },
        };
        await sendPushNotification(notificationObj);
    });
};

const updateReadStatus = async (req) => {
    try {
        return NotificationList.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true },
        );
    } catch (error) {
        logger.error('Error - list notification ', error);
        throw new Error(error);
    }
};

module.exports = {
    listAll,
    updateReadStatus,
    sendPushNotificationToUsers,
};
