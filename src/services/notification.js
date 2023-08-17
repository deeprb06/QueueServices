import Notification from ('../models/notification');
import user from ('../models/user');
import dbService from ('../utils/dbService');
import notificationJSON from ('../seeders/notification.json');
import { sendPushNotification } from ('../utils/sendPushNotification');
const seedNotifications = async () => {
    try {
        // eslint-disable-next-line global-require
        await Promise.all(
            notificationJSON.map(async (notification) => {
                let notificationFind = await dbService.getDocumentByQuery(
                    Notification,
                    { code: notification.code },
                );
                if (notificationFind) {
                    await dbService.updateDocument(
                        Notification,
                        notificationFind._id,
                        notification,
                    );
                } else {
                    await dbService.createDocument(Notification, notification);
                }
            }),
        );
        logger.info('Notifications seeded successfully!');
        return true;
    } catch (error) {
        logger.info(error);
        logger.error('Error in seedNotifications!');
        logger.error(error);
    }
};

const createOrUpdateToken = async (data) => {
    const userFind = await user.findOne({ _id: data.userId }).lean();
    const tokens = userFind.fcmTokens ?? [];
    let concatArray = userFind?.fcmTokens?.length
        ? tokens.concat([data.deviceToken])
        : [data.deviceToken];
    await user.updateOne(
        { _id: data.userId },
        { fcmTokens: _.uniq(concatArray) },
    );
};

const sendPushNotificationToUsers = async (data) => {
    data.fcmTokens.forEach(async (fcmToken) => {
        const notificationObj = {
            message: {
                token: fcmToken,
                notification: data.notificationPayload,
                data: {
                    click_action:
                        data?.click_action ?? process.env.CLIENT_FRONTEND_URL,
                    click_action_code: data?.click_action_code ?? 'ASSESSMENT',
                },
            },
        };
        await sendPushNotification(notificationObj);
    });
};

export default {
    seedNotifications,
    createOrUpdateToken,
    sendPushNotificationToUsers,
};
