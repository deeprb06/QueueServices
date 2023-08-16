import { Schema, model } from 'mongoose';
import idValidator from 'mongoose-id-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import { myCustomLabels } from '../config/common';
import { LOG_STATUS } from '../config/common';

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const schema = new Schema({
    type: {
        type: String,
        index: true
    },
    status: {
        type: String,
        default: LOG_STATUS.PENDING,
        index: true
    },
    sentData: {
        type: JSON
    },
    isActive: { type: Boolean, default: true},
    response: {
        type: JSON
    }
}, {
    timestamps: true
});

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const logs = model('logs', schema);
export default logs;