"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
/**
 * Custom error handler middleware
 */
const errorHandler = (err, req, res, next) => {
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
            .map((val) => val.message)
            .join(", ");
        statusCode = 400;
    }
    // Handle Multer Errors (File size limit, etc)
    if (err.name === 'MulterError' || err.code === "LIMIT_FILE_SIZE") {
        statusCode = 400;
        if (err.code === "LIMIT_FILE_SIZE") {
            message = "File is too large. Max limit is 2MB for profiles and 5MB for resumes.";
        }
    }
    const response = {
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
exports.errorHandler = errorHandler;
