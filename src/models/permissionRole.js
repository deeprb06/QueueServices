const mongoose = require('../../config/db');
const mongoosePaginate = require('mongoose-paginate-v2');
const idValidator = require('mongoose-id-validator');
const { myCustomLabels } = require('../config/constants/common');

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };
const Schema = mongoose.Schema;
const schema = new Schema(
    {
        permission_id: {
            type: Schema.Types.ObjectId,
            ref: 'permission',
        },
        role_id: {
            type: Schema.Types.ObjectId,
            ref: 'role',
        },
        canDel: {
            type: Boolean,
            default: true,
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

const permissionRole = mongoose.model(
    'permissionRole',
    schema,
    'permissionRole',
);

module.exports = permissionRole;
