import Joi from 'joi';

export const signupSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': 'Name should be a type of text',
        'string.empty': 'Name cannot be an empty field',
        'string.min': 'Name should have a minimum length of {#limit}',
        'any.required': 'Name is a required field'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is a required field'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password should have at least {#limit} characters',
        'any.required': 'Password is a required field'
    }),
    role: Joi.string().valid('admin', 'interviewer').default('interviewer')
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
