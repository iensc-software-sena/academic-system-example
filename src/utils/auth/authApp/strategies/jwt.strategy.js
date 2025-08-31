// Import the necessary modules from passport-jwt
import { Strategy, ExtractJwt } from "passport-jwt";
// Import the configuration settings
import { config } from "../../../../config/config.js";

// Define options for the JWT strategy
const options = {
  // Extract JWT from the Authorization header as a Bearer token
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // Secret key for verifying the JWT
  secretOrKey: config.authAppJwtKey
};

export const authAppJwtStrategy = new Strategy(options, (payload, done) => {
  // Pass the payload to the done function if verification is successful
  return done(null, payload);
});
