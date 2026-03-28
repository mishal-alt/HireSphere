import Joi from 'joi';

export const jobSchema = Joi.object({
    title: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Description should have at least {#limit} characters',
        'any.required': 'Title is a required field'
    }),
    department: Joi.string().min(2).max(50).required().messages({
        'any.required': 'Department is a required field'
    }),
    description: Joi.string().min(10).required().messages({
        'string.min': 'Description should have at least {#limit} characters',
        'any.required': 'Description is a required field'
    }),
    status: Joi.string().valid('Active', 'Paused', 'Closed').default('Active')
});

export const updateJobSchema = Joi.object({
    title: Joi.string().min(2).max(100),
    department: Joi.string().min(2).max(50),
    description: Joi.string().min(10),
    status: Joi.string().valid('Active', 'Paused', 'Closed')
});
