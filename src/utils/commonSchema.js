const mongoose = require('mongoose');
const joi = require('joi');
const Schema = mongoose.Schema;

module.exports = {
    fileSchema: {
        name: { type: String },
        uri: { type: String },
        mimeType: { type: String },
        fileSize: { type: Number },
    },
    userSchema: {
        firstName: { type: String },
        lastName: { type: String },
        fullName: { type: String },
        email: { type: String },
        id: { type: Schema.Types.ObjectId, ref: 'user' },
        mobNo: { type: String },
        mobCode: { type: String },
        clientNm: { type: String },
        isActive: { type: Boolean },
    },
    masterSchema: {
        id: { type: Schema.Types.ObjectId, ref: 'master' },
        name: { type: String },
        names: { type: Object },
        code: { type: String },
        desc: { type: String },
        extra: { type: String },
        isActive: { type: Boolean },
    },

    countrySchema: {
        name: { type: String },
        id: { type: Schema.Types.ObjectId, ref: 'country' },
        code: { type: String },
        isActive: { type: Boolean },
    },
    joiCountrySchema: {
        name: joi
            .string()
            .required()
            .error(new Error('Country name not allowed to be an empty.')),
        id: joi
            .string()
            .required()
            .error(new Error('Country-id not allowed to be an empty.')),
        code: joi
            .string()
            .required()
            .error(new Error('Country-code not allowed to be an empty.')),
    },
    joiFileSchema: {
        name: joi.string().required(),
        uri: joi.string().required(),
        mimeType: joi.string(),
        fileSize: joi.number(),
    },
    joiUserSchema: {
        firstName: joi.string().required(),
        lastName: joi.string().allow('', null),
        fullName: joi.string(),
        email: joi.string().required(),
        id: joi.string().required(),
        mobNo: joi.string().allow('', null),
        mobCode: joi.string().allow('', null),
        clientNm: joi.string().allow('', null),
        isActive: joi.boolean(),
    },
    joiMasterSchema: {
        id: joi.string().required(),
        name: joi.string().allow('', null),
        names: joi.object().allow('', null),
        code: joi.string().required(),
        desc: joi.string().allow('', null),
        extra: joi.string().allow('', null),
        isActive: joi.boolean(),
    },
};
