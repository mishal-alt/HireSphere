import { Request, Response, NextFunction } from "express";

/**
 * Standard Error response interface
 */
interface ErrorResponse {
  success: boolean;
  message: string;
  stack?: string;
  errors?: any;
}

/**
 * Custom error handler middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific Mongoose errors
  if (err.name === "CastError") {
    message = `Resource not found with id of ${err.value}`;
    statusCode = 404;
  }

  if (err.code === 11000) {
    message = "Duplicate field value entered";
    statusCode = 400;
  }

  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
    statusCode = 400;
  }

  const response: ErrorResponse = {
    success: false,
    message,
  };

  // Add stack trace in development
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  console.error(`[Error] ${statusCode} - ${message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(statusCode).json(response);
};
