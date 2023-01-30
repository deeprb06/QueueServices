import Joi from 'joi';

export const signUp = Joi.object({
    firstName: Joi.string().min(6).required(),
    lastName: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    mobileNo: Joi.number().allow(' ', null)
})

export const logIn = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
})