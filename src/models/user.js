import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import idValidator from 'mongoose-id-validator';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';
import { myCustomLabels } from '../config/constants/common';
import commonSchema from '../helpers/utils/commonSchema';
const { COUNTRY_CODE } = require('../config/constants/common');

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const schema = new Schema(
    {
        firstName: { type: String },
        lastName: { type: String },
        fullName: { type: String },
        file: commonSchema.fileSchema,
        isActive: { type: Boolean, default: true },
        email: {
            type: String,
            validate: {
                validator: async function (email) {
                    const user = await model('user').findOne({
                        email: { $exists: true, $eq: email },
                        _id: { $ne: this.id },
                        isDeleted: { $exists: false },
                    });
                    if (user) {
                        return this.id === user._id;
                    }
                    return true;
                },
                message: (props) => 'Email is already exists.',
            },
        },
        whatsapp: {
            no: { type: String },
            code: { type: String, default: COUNTRY_CODE.INDIA },
        },
        mobNo: { type: String },
        mobCode: { type: String, default: COUNTRY_CODE.INDIA },
        isDeleted: { type: Date },
        deletedBy: { type: Schema.Types.ObjectId, ref: 'user' },
        roleIds: [
            {
                type: Schema.Types.ObjectId,
                ref: 'role',
            },
        ],

        lastLogin: { type: Date },
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

        profileId: commonSchema.fileSchema,
        bio: { type: String },
        industry: commonSchema.masterSchema,
        country: commonSchema.masterSchema,
        state: { type: String },
        city: { type: String },
        canPopNoti: { type: Boolean },
        prefLng: commonSchema.masterSchema,
        deviceToken: { type: Array },
        fcmToken: { type: Array },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
        toJSON: {
            virtuals: true,
        },
    },
);

schema.pre('save', async function (next) {
    this.isDeleted = false;
    this.isActive = true;
    if (this?.passwords?.[0]?.pass) {
        this.passwords[0].pass = await bcrypt.hash(this.passwords[0].pass, 8);
        this.passwords[0].isActive = true;
        this.passwords[0].createdAt = convertToTz();
    }

    if (this.firstName !== undefined && this.lastName !== undefined) {
        this.fullName = `${this.firstName} ${this.lastName}`;
    }
    next();
});

schema.pre(['findOne', 'find', 'countDocuments'], function (next) {
    this.getQuery().isDeleted = false;
    next();
});

schema.pre(
    ['findOneAndUpdate', 'findByIdAndUpdate', 'updateOne'],
    async function (next) {
        let firstName = this.get('firstName');
        let lastName = this.get('lastName');
        if (firstName && lastName) {
            this.update({}, { fullName: `${firstName} ${lastName}` });
        }
        next();
    },
);

schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
schema.plugin(uniqueValidator);

const user = model('user', schema, 'user');

export default user;
