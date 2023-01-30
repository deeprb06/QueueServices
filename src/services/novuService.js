import { Novu } from '@novu/node';
import config from '../config';

const novu = new Novu(config.NOVU_API_KEY, { backendUrl: config.NOVU_BACKEND_URL });

export const addSubscriber = async(user) => {
    try {
        await novu.subscribers.identify(user.id, {
            email: user.email,
            phone: user.mobileNo,
            firstName: user.firstName,
            lastName: user.lastName
        })
    } catch (error) {
        console.log('error: in addSubscriber ', error);
    }
}

export const updateSubscriber = async(user) => {
    try {
        await novu.subscribers.update(user.id, {
            email: user.email,
            phone: user.mobileNo,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.profileId.uri
        })
    } catch (error) {
        console.log('error: in updateSubscriber ', error);
    }
}

export const sendMail = async(emailData) => {
    try {
        return result = await novu.trigger(emailData.eventName, {
            to: {
                subscriberId: emailData.user.id,
                email: emailData.email,
                firstName: emailData.firstName,
                lastName: emailData.lastName
            },
            payload: emailData.payload
        })
    } catch (error) {
        console.log('error: sendMail', error);
    }
}