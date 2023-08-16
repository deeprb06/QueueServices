import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import idValidator from 'mongoose-id-validator';
import { myCustomLabels } from '../config/common';

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

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

const permission = model('permission', schema, 'permission');

export default permission;
