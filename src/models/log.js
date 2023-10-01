const mongoose = require('../../config/db');
const mongoosePaginate = require('mongoose-paginate-v2');
const idValidator = require('mongoose-id-validator');
const { LOG_STATUS, myCustomLabels } = require('../config/constants/common');

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const Schema = mongoose.Schema;
const schema = new Schema(
    {
        type: {
            type: String, // USER_MIGRATE MAIL USER_IMPORT
            index: true,
        },
        status: {
            type: String,
            default: LOG_STATUS.PENDING,
            index: true,
        },
        data: {
            type: JSON,
        },
        response: {
            type: JSON,
        },
        createdBy: { type: Object },

        updatedBy: { type: Object },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    },
);

schema.pre('save', async function (next) {
    this.isDeleted = false;
    this.isActive = true;
    next();
});

schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const log = mongoose.model('log', schema, 'log');
module.exports = log;
