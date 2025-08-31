// Import Passport for authentication
import passport from 'passport';
// Import the auth-app JWT authentication strategy for JWT authentication
import { authAppJwtStrategy } from './authApp/strategies/jwt.strategy.js';

// Use the auth-app JwtStrategy for JWT authentication
passport.use(authAppJwtStrategy);
