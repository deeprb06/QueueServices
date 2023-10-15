const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { myCustomLabels } = require('../config/constants/common');

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const schema = new mongoose.Schema(
    {
        name: { type: String },
        code: { type: String },
        url: { type: String },
        details: { type: mongoose.Schema.Types.Mixed },
        isActive: { type: Boolean },
        deletedAt: { type: Date },
        deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    },
    { timestamps: true },
);

const setting = mongoose.model('setting', schema);

schema.plugin(mongoosePaginate);

module.exports = setting;
