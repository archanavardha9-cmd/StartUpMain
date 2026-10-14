const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error(`[Server Error] ${err.name}: ${err.message}`);

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
    return errorResponse(res, 400, `Resource not found with id of ${err.value}`);
  }

  // Duplicate key error
  if (err.code === 11000) {
    return errorResponse(res, 400, 'Duplicate field value entered');
  }

  const statusCode =
    err.status || err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  return errorResponse(
    res,
    statusCode,
    err.message || 'Internal Server Error',
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
};

module.exports = errorHandler;
