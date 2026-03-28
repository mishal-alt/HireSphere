import Joi from 'joi';

export const createInterviewerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    department: Joi.string().min(2).required(),
    isActive: Joi.boolean().default(true)
});

export const updateInterviewerSchema = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().email(),
    department: Joi.string().min(2),
    isActive: Joi.boolean()
});
