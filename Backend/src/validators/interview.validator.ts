import Joi from 'joi';

export const createInterviewSchema = Joi.object({
    candidateId: Joi.string().required().messages({
        'any.required': 'Candidate ID is required'
    }),
    interviewerId: Joi.string().required().messages({
        'any.required': 'Interviewer ID is required'
    }),
    scheduledAt: Joi.date().iso().required().messages({
        'date.iso': 'Scheduled at must be a valid ISO date',
        'any.required': 'Schedule date is required'
    }),
    title: Joi.string().allow('', null).default('Technical Interview')
});

export const updateInterviewSchema = Joi.object({
    candidateId: Joi.string(),
    interviewerId: Joi.string(),
    scheduledAt: Joi.date().iso(),
    title: Joi.string().allow('', null),
    status: Joi.string().valid('Scheduled', 'Ongoing', 'Completed', 'Cancelled')
});
