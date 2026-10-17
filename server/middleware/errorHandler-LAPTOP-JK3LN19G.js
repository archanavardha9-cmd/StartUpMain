const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('[Server Error]', {
    name: err.name,
    code: err.code,
    status: err.status || err.statusCode,
  });

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const formattedErrors =  Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    return errorResponse(res, 400, 'Validation Error', formattedErrors);
  }

  // Mongoose Cast Error (Bad ObjectId)
  if (err.name === 'CastError') {
    return errorResponse(res, 400, 'Invalid resource identifier');
  }

  // Duplicate key error
  if (err.code === 11000) {
    return errorResponse(res, 400, 'Duplicate field value entered');
  }

  const statusCode =
    err.status || err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  const message =
    statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error';
  return errorResponse(
    res,
    statusCode,
    message,
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
};

module.exports = errorHandler;
