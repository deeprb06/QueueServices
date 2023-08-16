import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import idValidator from 'mongoose-id-validator';
import uniqueValidator from 'mongoose-unique-validator';
import { myCustomLabels } from '../config/common';
import { dbHooks } from '../helpers/utils/dbservices';


mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        weight: {
            type: Number,
            required: true,
        },

        code: {
            type: String,
            required: true,
            unique: true,
        },

        isActive: { type: Boolean },
        canDel: { type: Boolean, default: true },

        createdAt: { type: Date },

        updatedAt: { type: Date },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },

        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },

        deletedAt: { type: Date },
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
    this.isActive = true;
    next();
});
schema.virtual('permissions', {
    ref: 'permissionRole',
    localField: '_id',
    foreignField: 'role_id',
});

dbHooks(schema);

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
schema.plugin(uniqueValidator);

const role = model('role', schema, 'role');

export default role;
