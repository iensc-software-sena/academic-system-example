// Import the Router class from Express
import { Router } from "express";
// Import the middleware to verify tokens from the authentication app
import { authAppVerifyToken } from
'../middlewares/tokenHandlers/authAppTokenHandler.js';
// Import the controllers functions to authenticate and manage users
import { loginUser } from '../controllers/users/login.js';
import { createOneUser } from '../controllers/users/create.js';
import { deleteOneUser } from '../controllers/users/delete.js';
import { updateOneUser } from '../controllers/users/update.js';
import { updatePassword } from '../controllers/users/password.js';
import { listOneUser } from '../controllers/users/listOne.js';
import { listAllUsers } from '../controllers/users/listAll.js';

// Create a new Router instance
export const userRouter = Router();

// Define a POST route for users authentication
userRouter.post(
  // Route path to authenticate a users
  '/login',
  // Controller function to login a user
  loginUser
);

// Define a POST route for create an user
userRouter.post(
  // Route path to create a user
  '/create',
  // Middleware to verify the token before proceeding to the controller
  authAppVerifyToken,
  // Controller function to create the user
  createOneUser
);

// Define a POST route to update an user
userRouter.post(
  // Route path to update a user
  '/update',
  // Middleware to verify the token before proceeding to the controller
  authAppVerifyToken,
  // Controller function to update the user data
  updateOneUser
);

// Define a POST route to update an user password
userRouter.post(
  // Route path to update a user
  '/password',
  // Middleware to verify the token before proceeding to the controller
  authAppVerifyToken,
  // Controller function to update the user password
  updatePassword
);

// Define a POST route to delete an user
userRouter.post(
  // Route path to delete a user
  '/delete',
  // Middleware to verify the token before proceeding to the controller
  authAppVerifyToken,
  // Controller function to delete the user
  deleteOneUser
);

// Define a POST route to list an user
userRouter.post(
  // Route path to list an user
  '/listone',
  // Middleware to verify the token before proceeding to the controller
  authAppVerifyToken,
  // Controller function to list a user
  listOneUser
);

// Define a GET route to list all users
userRouter.get(
  // Route path to list all users
  '/listall',
  // Middleware to verify the token before proceeding to the controller
  authAppVerifyToken,
  // Controller function to list all users
  listAllUsers
);
