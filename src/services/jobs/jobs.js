const notificationService = require('../services/notification');
const { sendEmail } = require('../services/emailService');
const { refDataDelete, refDataUpdate } = require('../utils/helpers');
const { sendSMS } = require('../services/smsService');

module.exports = {
    _processors: {
        sendMail: async ({ data }) => {
            try {
                logger.info('processing email sent');
                await sendEmail(data);
                logger.info('finish email sent');
                return { succeed: true };
            } catch (error) {
                console.error('Error in email sent' + error);
                return { succeed: false };
            }
        },

        sendNotification: async ({ data }) => {
            try {
                logger.info('processing notification sent');
                await notificationService.sendPushNotificationToUsers(data);
                logger.info('finish notification sent');
                return { succeed: true };
            } catch (error) {
                console.error('Error in notification sent' + error);
                return { succeed: false };
            }
        },

        refDataUpdation: async ({ data }) => {
            try {
                logger.info('Processing start reference updation');
                await refDataUpdate(data);
                logger.info('Processing finish reference updation');
            } catch (error) {
                logger.error('Error in refDataUpdation' + error);
            }
        },

        refDataDeletion: async ({ data }) => {
            try {
                logger.info('Processing start reference deletion');
                await refDataDelete(data);
                logger.info('Processing finish reference deletion');
            } catch (error) {
                logger.error('Error in refDataDeletion' + error);
            }
        },

        sendSms: async ({ data }) => {
            try {
                logger.info('Processing start SMS sent.');
                await sendSMS(data);
                logger.info('Processing finish SMS sent.');
            } catch (error) {
                logger.error('Error in sendSms' + error);
            }
        },
    },
};
