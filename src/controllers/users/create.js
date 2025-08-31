// Import the UserServices class from the userServices module
import { UserServices } from '../../services/userServices.js';
// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

export const createOneUser = async (req, res, next) => {

  // Extract username and password from the request body
  const newUser = {
    id: req.body.newUserData.id,
    username: req.body.newUserData.username,
    password: req.body.newUserData.password,
    role: req.body.newUserData.role,
    email: req.body.newUserData.email,
    phone: req.body.newUserData.phone,
    address: req.body.newUserData.address,
    registrationNumber: req.body.newUserData.registrationNumber,
    program: req.body.newUserData.program,
    firstName: req.body.newUserData.firstName,
    middleName: req.body.newUserData.middleName,
    firstLastName: req.body.newUserData.firstLastName,
    secondLastName: req.body.newUserData.secondLastName,
  };

  // Instantiate the UserServices class to manage the users operations
  const userManager = new UserServices();

  try {
    // Attempt to create a new user using the provided data
    const response = await userManager.createOne(newUser);

    // If the user is created successfully, send a success response
    if (response.status === 'CREATED SUCCESSFULLY') {
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        // Include the new token in the response
        authentication: res.locals.newUserToken
      });
    }

  } catch (err) {
    if (Boom.isBoom(err)) {
      return next(err);
    }
    // Handle errors during user creation by sending a Boom error response
    const boomError = Boom.serverUnavailable(
      'Unable to create the user in the database',
      err
    );
    // Pass the Boom error to the next middleware in the stack
    next(boomError);
  }
};
