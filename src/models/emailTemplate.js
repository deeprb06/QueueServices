const mongoose = require('../../config/db');
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'data',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: 'slNo',
    meta: 'paginator',
};
mongoosePaginate.paginate.options = { customLabels: myCustomLabels };
const Schema = mongoose.Schema;
const schema = new Schema(
    {
        nm: {
            type: String,
        },
        code: {
            type: String,
            unique: true,
        },
        parentCode: {
            type: String,
        },
        subject: {
            type: String,
        },
        body: {
            type: String,
        },
        htmlPath: {
            type: String,
        },
        cssPath: {
            type: String,
        },
        resultTemplate: {
            type: Boolean,
            default: true,
        },
        defRecep: { type: Array },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        deletedAt: {
            type: Date,
        },
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);
schema.pre('save', async function (next) {
    this.isDeleted = false;
    this.isActive = true;
    next();
});

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const template = mongoose.model('emailTemplate', schema, 'email_template');
module.exports = template;
