import { sendMail } from '../novuService';
// import { sendNotifications } from '../sendNotification';
export const _processors = {
        sendMail: async(processObj) => {
            try {
                console.log('Email processing started!');
                await sendMail(processObj.data);
                console.log('Email processing completed!');
            } catch(error) {
                console.error('Error - sendMailProcess', error);
            }
        },
        sendNotifications : async(processObj) => {
            try {
                console.log('Notifications processing started!');
                await sendNotifications(processObj.data);
                console.log('Notifications processing completed!');
            } catch(error) {
                console.error('Error - sendNotificationsProcess', error);
            }
        }
}