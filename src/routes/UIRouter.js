// Import the Router class from Express
import { Router } from "express";
// Import the middleware to verify tokens from the authentication app
import { authAppVerifyToken } from
'../middlewares/tokenHandlers/authAppTokenHandler.js';
// Import the controllers functions to manage user interfaces templates
import { loginForm } from '../controllers/UI/loginForm.js';
import { registerForm } from '../controllers/UI/registerForm.js';
import { dashboard } from '../controllers/UI/dashboard.js';
import { profile } from '../controllers/UI/profile.js';

// Create a new Router instance
export const UIRouter = Router();

// Define a GET route for login view
UIRouter.get(
  // Route path display the login view
  '/',
  // Controller function to render a login template
  loginForm
);

// Define a GET route for user register view
UIRouter.get(
  // Route path display the user register view
  '/register',
  // Controller function to render a user register template
  registerForm
);


// Define a GET route for dashboard view
UIRouter.get(
  // Route path display the dashboard view
  '/dashboard',
  // Middleware to verify the token before proceeding to the controller
  authAppVerifyToken,
  // Controller function to render a dashboard template
  dashboard
);

// Define a GET route for certificate academic form view
UIRouter.get(
  // Route path display the certificate academic form view
  '/profile',
  // Middleware to verify the token before proceeding to the controller
  authAppVerifyToken,
  // Controller function to render a dashboard template
  profile
);
