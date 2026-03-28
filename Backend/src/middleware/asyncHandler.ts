import { Request, Response, NextFunction } from "express";

/**
 * Async handler to avoid repetitive try-catch blocks
 * It catches any error and passes it to the next() function
 */
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
