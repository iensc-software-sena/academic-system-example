import Boom from '@hapi/boom';
import { config } from '../config/config.js';

export const checkApiKey = (req, res, next) => {
  // Extract the API key from the request headers
  const APIKey = req.headers['apikey'];

  // Check if the API key matches the expected value
  if (APIKey === config.APIKey) {
    next(); // Proceed to the next middleware or route handler
  } else {
    // Create an unauthorized error using Boom
    const boomError = Boom.unauthorized('Invalid API key');
    next(boomError); // Pass the error to the next middleware
  }
}
