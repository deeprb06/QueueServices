const mongoose = require('../../config/db');
const mongoosePaginate = require('mongoose-paginate-v2');
const idValidator = require('mongoose-id-validator');
const { myCustomLabels } = require('../config/constants/common');

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };
const Schema = mongoose.Schema;
const schema = new Schema(
    {
        route_name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        module: {
            type: String,
            required: true,
        },
        uri: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
        toJSON: { virtuals: true },
    },
);

schema.pre('save', async function (next) {
    this.isDeleted = false;
    this.isActive = true;
    next();
});

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const permission = mongoose.model('permission', schema, 'permission');

module.exports = permission;
