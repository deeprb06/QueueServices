const admin = require('firebase-admin');
const Settings = require('../models/setting');
const { FIREBASE_PRIVATE_KEY } = require('../config/constants/common');

new Promise((resolve, reject) => {
    try {
        const firebaseConfig = Settings.findOne({ code: FIREBASE_PRIVATE_KEY });
        resolve(firebaseConfig);
    } catch (error) {
        console.error('error: ', error);
        reject(error);
    }
}).then((firebaseData) => {
    if (!firebaseData?.details || !Object.keys(firebaseData?.details).length) {
        logger.error('Firebase private key not found in DB.');
    }
    admin.initializeApp({
        credential: admin.credential.cert(firebaseData?.details),
    });
    logger.info('Firebase Notification Initialized!🔥');
});
