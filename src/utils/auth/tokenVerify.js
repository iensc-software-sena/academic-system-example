// Import the jsonwebtoken library for handling JWT operations
import jwt from 'jsonwebtoken';

export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
