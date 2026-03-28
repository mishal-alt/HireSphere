import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export const validate = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { 
            abortEarly: false, 
            allowUnknown: true, 
            stripUnknown: true 
        });

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return res.status(400).json({ 
                success: false, 
                message: errorMessage 
            });
        }

        next();
    };
};
