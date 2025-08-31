// Import the Boom library for HTTP-friendly error objects
import Boom from '@hapi/boom';

export const validatorHandler = (schema, property) => {
  // Return a middleware function
  return (req, res, next) => {
    // Extract the data from the specified property of the request object
    const data = req[property];

    // Validate the data against the provided schema with Joi
    const { error } = schema.validate(data, { abortEarly: false });

    // If there is a validation error, create a Boom bad request error and
    // pass it to the next middleware
    if (error) {
      const boomError = Boom.badRequest(error);
      next(boomError);
    }

    // If no error, proceed to the next middleware
    next();
  }
}
