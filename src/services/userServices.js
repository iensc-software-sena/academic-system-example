// import the data base pool of connections
import { pool } from '../DB/index.js';
// import the promise to encrypt the user's password
import { hashPassword } from '../utils/auth/passwordHash.js';
// import the module to sign a JWT
import { signUserToken } from '../utils/auth/tokenSign.js';
// bcrypt takes care of hashing the user's password
import bcrypt from 'bcryptjs';
// boom allows managing possible errors
import Boom from '@hapi/boom';
// import the configuration module
import { config } from '../config/config.js'

// create the user services class
export class UserServices {

  async login(username, password) {
    try {
      // Find the user by their username in the database
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      const userRecord = rows[0];

      // if not found a user in the database
      if (!userRecord) {
        return { status: 'user not found' };
      }

      // Compare the provided password with the stored password hash
      const validPassword = await bcrypt.compare(
        password,
        userRecord.password
      );

      if (!validPassword) {
        return { status: 'wrong password' };
      }

      // Generate JWT token with user data
      const userToken = signUserToken(
        { id: userRecord.id },
        config.authAppJwtKey,
        '1h'
      );

      // Resolves the promise with the JWT token
      return { status: 'logged', token: userToken };
    } catch (error) {
      // Return a Boom error if there's an exception
      throw Boom.boomify(error, {
        message: 'Unable to verify user credentials',
      });
    }
  }

  async createOne(newUser) {
    try {
      // searches the database if there is a user with this username
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ?',
        [newUser.username]
      );

      // if user exists, reject the user insertion
      if (rows.length > 0) {
        throw Boom.conflict('Username already exists');
      }

      // hash the user password before it is recorded
      const hash = await hashPassword(newUser.password);

      // create a new record in the database
      await pool.query(
        `INSERT INTO users (username, password, email, firstName, middleName, firstLastName, secondLastName)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          newUser.username,
          hash,
          newUser.email,
          newUser.firstName,
          newUser.middleName,
          newUser.firstLastName,
          newUser.secondLastName,
        ]
      );

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };
    } catch (error) {
      // Return a Boom error if there's an exception
      throw Boom.boomify(error, {
        message: 'Unable to create new user',
      });
    }
  }

  async updateOne(userId, newUserData) {

    if (!newUserData) {
      // return an error response
      throw Boom.badRequest('No data provided');
    }

    try {
      // hash the new user password before saving it in the database
      const hash = await hashPassword(newUserData.password);

      // update the record in the database
      const [result] = await pool.query(
        `UPDATE users
         SET username = ?, password = ?, email = ?, firstName = ?, middleName = ?, firstLastName = ?, secondLastName = ?
         WHERE id = ?`,
        [
          newUserData.username,
          hash,
          newUserData.email,
          newUserData.firstName,
          newUserData.middleName,
          newUserData.firstLastName,
          newUserData.secondLastName,
          userId,
        ]
      );

      // if no rows were updated, return an error
      if (result.affectedRows === 0) {
        throw Boom.notFound('User not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (error) {
      // Return a Boom error if there's an exception
      throw Boom.boomify(error, {
        message: 'Unable to update user',
      });
    }
  }

  async deleteOne(userId) {

    // return an error response
    if (!userId) {
      throw Boom.badRequest('No user ID provided');
    }

    try {
      // destroy the record in the database
      const [result] = await pool.query(
        'DELETE FROM users WHERE id = ?',
        [userId]
      );

      // if no rows were deleted, return an error
      if (result.affectedRows === 0) {
        throw Boom.notFound('User not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };
    } catch (error) {
      // return a Boom error if there's an exception deleting the record
      throw Boom.boomify(error, {
        message: 'Unable to delete user',
      });
    }
  }

  async listOne(userId) {
    // return an error response
    if (!userId) {
      throw Boom.badRequest('No user ID provided');
    }

    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );

      if (rows.length === 0) {
        // return an error response
        throw Boom.notFound('User not found');
      }

      const theUser = rows[0];
      delete theUser.password;

      return theUser;
    } catch (error) {
      // return a Boom error if there's an exception finding the user
      throw Boom.boomify(error, {
        message: 'Unable to find user',
      });
    }
  }

  async listAll() {
    try {
      // save all records in the constant
      const [rows] = await pool.query('SELECT * FROM users ORDER BY id ASC');

      // if no records exist
      if (!rows.length) {
        return [];
      }

      const theUsers = rows.map((user) => {
        delete user.password;
        return user;
      });

      return theUsers;
    } catch (error) {
      // return a Boom error if there's an exception finding all users
      throw Boom.boomify(error, {
        message: 'Unable to find users',
      });
    }
  }
}
