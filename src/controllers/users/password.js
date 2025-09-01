// Import the UserServices class from the userServices module
import { UserServices } from '../../services/userServices.js';
// Import Boom to create HTTP-friendly error objects
import Boom from '@hapi/boom';

export const updatePassword = async (req, res, next) => {

  // Extract user credentials from the request body
  const { id, userName, email, newPassword } = req.body.credentials;

  // Instantiate the UserServices class to manage user operations
  const userManager = new UserServices();

  try {
    // Attempt to update the user password in the database
    const response = await userManager.updatePassword(id, userName, email, newPassword);

    // If the update is successful, return a 201 response with a success message
    if (response.status === 'PASSWORD UPDATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'Password updated successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (err) {
    if(Boom.isBoom(err)) {
      return next(err)
    }
    // Handle errors during the update process by returning a 503 error
    const boomError = Boom.badImplementation(
      'Unable to update password in database',
      err
    );
    next(boomError);
  }
};
