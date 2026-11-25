import mongoose from 'mongoose';
import { ZodError } from 'zod';

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error.';
  let details;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Request validation failed.';
    details = {
      ...err.flatten(),
      issues: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    };
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Database validation failed.';
    details = Object.fromEntries(
      Object.entries(err.errors).map(([field, fieldError]) => [field, fieldError.message]),
    );
  } else if (err?.code === 11000) {
    statusCode = 409;
    message = 'A record with the same unique value already exists.';
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'One or more request values are invalid.';
  } else if (err?.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'Uploaded files must be 5 MB or smaller.';
  } else if (err?.code === 'LIMIT_FILE_COUNT' || err?.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Only one resume file can be uploaded at a time.';
  }

  if (statusCode >= 500 && !err.expose) {
    console.error(err);
  }

  const response = {
    success: false,
    message: statusCode >= 500 && !err.expose ? 'Internal server error.' : message,
  };

  if (details) {
    response.details = details;
  }

  res.status(statusCode).json(response);
}
