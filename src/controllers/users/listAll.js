// Import the UserServices class from the userServices module
import { UserServices } from '../../services/userServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

export const listAllUsers = async (req, res, next) => {

  // Instantiate the UserServices class to manage the users operations
  const userManager = new UserServices();

  try {
    // Attempt to retrieve all user records from the database
    const allRecords = await userManager.listAll();

    // If records are found, send a success response with the user data
    if (allRecords && allRecords.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        users: allRecords
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'No users found',
        // Include the new token in the response
        authentication: res.locals.newUserToken,
        users: []
      });
    }

  } catch (err) {
    if (Boom.isBoom(err)) {
      return next(err);
    }
    // Handle errors during user retrieval by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to retrieve users from the database',
      err
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};
