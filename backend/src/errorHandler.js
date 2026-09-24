// Central error handling so controllers can just `throw` or `next(err)`.

class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Wraps async route handlers so rejected promises reach the error handler
// instead of crashing the process or hanging the request.
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// Maps known Prisma error codes to sensible HTTP responses.
function mapPrismaError(err) {
  if (err.code === 'P2025') {
    // Record to update/delete was not found.
    return new ApiError(404, 'Resource not found');
  }
  if (err.code === 'P2003') {
    // Foreign key constraint failed (e.g. deckId doesn't exist).
    return new ApiError(400, 'Related resource does not exist');
  }
  return null;
}

// Express error-handling middleware — must have 4 args to be recognized as such.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const mapped = err.code ? mapPrismaError(err) : null;
  const finalErr = mapped || err;

  const statusCode = finalErr.statusCode || 500;
  const payload = {
    error: {
      message: statusCode === 500 ? 'Internal server error' : finalErr.message,
    },
  };
  if (finalErr.details) {
    payload.error.details = finalErr.details;
  }
  if (statusCode === 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json(payload);
}

module.exports = { ApiError, asyncHandler, errorHandler };
