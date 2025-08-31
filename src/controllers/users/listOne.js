// Import the UserServices class from the userServices module
import { UserServices } from '../../services/userServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

export const listOneUser = async (req, res, next) => {

  // Destructure the user ID from the request body
  const { id } = req.body;

  // Instantiate the UserServices class to manage user operations
  const userManager = new UserServices();

  try {
    // Attempt to find the user record by ID
    const record = await userManager.listOne(id);

    // If the user record is found, send a success response with the user data
    if (record) {
      return res.status(201).json({
        success: true,
        message: 'User found successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        user: record
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

  } catch (error) {
    // Handle errors during the user retrieval process by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve the user from the database',
      error
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};
