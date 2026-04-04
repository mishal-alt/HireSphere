import Joi from 'joi';

export const createCandidateSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow('', null),
    experience: Joi.string().allow('', null),
    education: Joi.string().allow('', null),
    jobId: Joi.string().allow('', null),
    resumeUrl: Joi.string().uri().allow('', null),
    status: Joi.string().valid('Applied', 'Shortlisted', 'Interviewed', 'Rejected', 'Hired').default('Applied')
});

export const updateCandidateSchema = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().email(),
    phone: Joi.string().allow('', null),
    experience: Joi.string().allow('', null),
    education: Joi.string().allow('', null),
    jobId: Joi.string().allow('', null),
    resumeUrl: Joi.string().uri().allow('', null),
    status: Joi.string().valid('Applied', 'Shortlisted', 'Interviewed', 'Rejected', 'Hired')
});
