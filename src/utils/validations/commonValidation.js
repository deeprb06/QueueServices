/*
 * modelValidation.js
 * purpose     : request validation
 * description : validate each post and put request as per mongoose model
 **/
import joi from 'joi';

const updateSchemaKeys = joi
    .object({
        id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
        createdBy: joi.object(),
        updatedBy: joi.object(),
        deletedBy: joi.object(),
        deletedAt: joi.date(),
        isActive: joi.boolean().default(true),
        isDeleted: joi.boolean().default(false),
        name: joi.string(),
        email: joi.string().email(),
    })
    .unknown(false);

const login = joi
    .object({
        password: joi.string().required(),
        email: joi.string().email().required().label('Email'),
    })
    .unknown(false);

const forgetpassword = joi
    .object({
        email: joi.string().required(),
    })
    .unknown(false);

const resetpassword = joi
    .object({
        email: joi.string().required(),
        password: joi.string().required(),
        code: joi.string().required(),
    })
    .unknown(false);

const updatePermission = joi
    .object({
        roleId: joi
            .string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        permissionIds: joi
            .array()
            .items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
            .required(),
    })
    .unknown(false);

const verifyLoginOtp = joi
    .object({
        email: joi.string().required(),
        code: joi.string().required(),
    })
    .unknown(false);

const resendLoginOtp = joi
    .object({
        email: joi.string().required(),
    })
    .unknown(false);

const changePassword = joi
    .object({
        password: joi.string().required(),
        newPassword: joi.string().required(),
    })
    .unknown(false);

const userCreateSchemaKeys = joi
    .object({
        id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
        Nm: joi.string().required(),
        password: joi
            .string()
            .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{6,}$/),
        email: joi.string().email().required(),
        allowPltLogin: joi.boolean().required().messages({
            'any.required': `Become a platform user is required`,
        }),
        allowAzure2FA: joi.boolean().messages({
            boolean: `Allow Azure2FA is boolian`,
        }),
        createdBy: joi.object(),
        updatedBy: joi.object(),
        deletedBy: joi.object(),
        deletedAt: joi.date(),
        isActive: joi.boolean().default(true),
        isDeleted: joi.boolean().default(false),
    })
    .unknown(false);

const partialUpdateSchemaKeys = joi
    .object({
        isActive: joi.boolean().required(),
    })
    .unknown(false);

const roleCreate = joi
    .object({
        code: joi
            .string()
            .regex(/^[A-Z0-9_]*$/)
            .required()
            .messages({
                'string.base': `"" Please enter role`,
                'string.pattern.base': `"" Please enter valid role`,
                'string.empty': `"" cannot be an empty field`,
                'any.required': `"" is a required field`,
            }),
        name: joi.string().required(),
        weight: joi.string().required(),
    })
    .unknown(false);

const roleUpdate = joi
    .object({
        code: joi
            .string()
            .regex(/^[A-Z0-9_]*$/)
            .required(),
        name: joi.string().required(),
        weight: joi.string().required(),
    })
    .unknown(false);

export default {
    updateSchemaKeys,
    login,
    forgetpassword,
    resetpassword,
    updatePermission,
    resendLoginOtp,
    verifyLoginOtp,
    changePassword,
    userCreateSchemaKeys,
    partialUpdateSchemaKeys,
    roleCreate,
    roleUpdate
}