// Import the jsonwebtoken library for handling JWT operations
import jwt from 'jsonwebtoken';

export const signUserToken = (payload, secret, timer) => {
  return jwt.sign(payload, secret, { expiresIn: timer });
};
