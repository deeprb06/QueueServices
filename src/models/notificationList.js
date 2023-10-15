const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { myCustomLabels } = require('../config/constants/common');

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels,
};

const schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            index: true,
        },
        msg: { type: String },
        type: { type: Number }, // 1 for push notifications.
        isRead: { type: Boolean, default: false },
        updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    },
    { timestamps: true },
);

schema.plugin(mongoosePaginate);

const notificationList = mongoose.model('notificationsList', schema);

module.exports = notificationList;
