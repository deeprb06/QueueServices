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
    updateReadStatus
};
