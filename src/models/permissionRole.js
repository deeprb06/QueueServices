import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import idValidator from 'mongoose-id-validator';
import { myCustomLabels } from '../config/common';

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

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

const permissionRole = model('permissionRole', schema);

export default permissionRole;
