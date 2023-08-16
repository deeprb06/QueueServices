import { Schema, model } from 'mongoose';
import idValidator from 'mongoose-id-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import { myCustomLabels } from '../config/common';

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels,
};

const settingsSchema = new Schema(
    {
        name: { type: Schema.Types.String },
        code: { type: Schema.Types.String },
        url: { type: Schema.Types.String },
        details: { type: Schema.Types.Mixed },
        isActive: {
            type: Boolean,
            default: true,
        },
        deletedAt: {
            type: Date,
        },
        deletedBy: { type: Schema.Types.ObjectId, ref: 'user' },
    },
    {
        timestamps: true,
    },
);

settingsSchema.pre(['findOne', 'find'], function (next) {
    this.getQuery().isDeleted = { $exists: false };
    next();
});

settingsSchema.plugin(mongoosePaginate);
settingsSchema.plugin(idValidator);

const settings = model('settings', settingsSchema);

export default settings;
