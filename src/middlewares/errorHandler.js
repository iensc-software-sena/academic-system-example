// Import Boom for HTTP-friendly error objects
import Boom from '@hapi/boom';


export const logError = (err, req, res, next) => {
  // Pass the error to the next middleware
  next(err);
}


export const errorHandler = (err, req, res, next) => {
  // Send a 500 Internal Server Error response with error details
  res.status(500).json({
    message: err.message,
    stack: err.stack
  });
}


export const boomErrorHandler = (err, req, res, next) => {
  // Check if the error is a Boom error
  if (Boom.isBoom(err)) {
    // Send the Boom error response
    res.status(err.output.statusCode).json(err.output.payload);
  } else {
    // Pass the error to the next middleware
    next(err);
  }
}
