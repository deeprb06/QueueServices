import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import idValidator from 'mongoose-id-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import { myCustomLabels } from '../config/common';

mongoosePaginate.paginate.options = {
    customLabels: myCustomLabels
}

const userSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    countryCode: { type: String, default: 91 },
    mobileNo: { type: String },
    isActive: { type: Boolean, default: true }, //isActive
    profileId: { type: Schema.Types.ObjectId, ref: 'file' },
    deletedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
    updatedBy: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    deletedBy: { type: Schema.Types.ObjectId, ref: 'user' },
},
{
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.__v;
        },
    },
}, 
{ timestamps: true })


userSchema.pre('save', async function (next) {
    if (this.email) {
        this.email = this.email.toLowerCase().trim();
    }
    bcrypt.hash(this.password, 10 , (error, hash) => {
        if(error) {
            return next(error);
        }
        this.password = hash;
        next();
    })
});

userSchema.pre(['findOne', 'find'], function (next) {
  this.getQuery().deletedAt = { $exists: false };
  next();
});

userSchema.methods.comparePassword = async function (passw) {
    return await bcrypt.compare(passw, this.password);
};

userSchema.plugin(mongoosePaginate);
userSchema.plugin(idValidator);

const user = model('user', userSchema);

export default user;
