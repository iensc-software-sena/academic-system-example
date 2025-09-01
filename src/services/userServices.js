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

  async login(userName, password) {
    try {
      // Find the user by their username in the data base
      const [ rows ] = await pool.query(
        'SELECT * FROM Users WHERE userName = ?',
        [userName]
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
    } catch (err) {
      throw Boom.boomify(err, {
        message: 'Unable to verify user credentials',
      });
    }
  }

  async createOne(newUser) {
    try {
      // searches the database if there is a user with this username or id
      const [rows] = await pool.query(
        'SELECT * FROM Users WHERE userName = ? OR id = ?',
        [newUser.userName, newUser.id]
      );

      // if user exists, reject the user insertion
      if (rows.length > 0) {
        // Check which field is the repeater
        if (rows.some(r => r.userName === newUser.userName)) {
          throw Boom.conflict('Username already exists');
        }
        if (rows.some(r => r.id === newUser.id)) {
          throw Boom.conflict('User ID already exists');
        }
      }

      // hash the user password before it is recorded
      const hash = await hashPassword(newUser.password);

      // create a new record in the database
      await pool.query(
        `INSERT INTO Users (
          id,
          userName,
          password,
          role,
          email,
          phone,
          address,
          registrationNumber,
          program,
          firstName,
          middleName,
          firstLastName,
          secondLastName
        )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newUser.id,
          newUser.userName,
          hash,
          newUser.role,
          newUser.email,
          newUser.phone,
          newUser.address,
          newUser.registrationNumber,
          newUser.program,
          newUser.firstName,
          newUser.middleName,
          newUser.firstLastName,
          newUser.secondLastName,
        ]
      );

      // return a success response
      return { status: 'CREATED SUCCESSFULLY' };
    } catch (err) {
      // Return a Boom error if there's an exception
      throw Boom.boomify(err, {
        message: 'Unable to create new user',
      });
    }
  }

  async updateOne(id, newUserData) {
    if (!newUserData) {
      // return an error response
      throw Boom.badRequest('No data provided');
    }

    try {
      // update the record in the database
      const [result] = await pool.query(
        `UPDATE Users
         SET
          userName = ?,
          role = ?,
          email = ?,
          phone = ?,
          address = ?,
          registrationNumber = ?,
          program = ?,
          firstName = ?,
          middleName = ?,
          firstLastName = ?,
          secondLastName = ?
         WHERE id = ?`,
        [
          newUserData.userName,
          newUserData.role,
          newUserData.email,
          newUserData.phone,
          newUserData.address,
          newUserData.registrationNumber,
          newUserData.program,
          newUserData.firstName,
          newUserData.middleName,
          newUserData.firstLastName,
          newUserData.secondLastName,
          id,
        ]
      );

      // if no rows were updated, return an error
      if (result.affectedRows === 0) {
        throw Boom.notFound('User not found');
      }

      // return a success response
      return { status: 'UPDATED SUCCESSFULLY' };
    } catch (err) {
      // Return a Boom error if there's an exception
      throw Boom.boomify(err, {
        message: 'Unable to update user',
      });
    }
  }

  async updatePassword(id, userName, email, newPassword) {
    if (!id || !userName || !email || !newPassword) {
      throw Boom.badRequest('Missing data for password update');
    }

    try {
      // Verify that the user exists with the given ID, username, and email
      const [rows] = await pool.query(
        'SELECT * FROM Users WHERE id = ? AND userName = ? AND email = ?',
        [id, userName, email]
      );

      if (rows.length === 0) {
        throw Boom.notFound('User not found with provided credentials');
      }

      // Hash the new password
      const hash = await hashPassword(newPassword);

      // Update the password
      const [result] = await pool.query(
        'UPDATE Users SET password = ? WHERE id = ?',
        [hash, id]
      );

      if (result.affectedRows === 0) {
        throw Boom.notFound('Password not updated');
      }

      return { status: 'PASSWORD UPDATED SUCCESSFULLY' };
    } catch (err) {
      // Return a Boom error if there's an exception
      throw Boom.boomify(err, {
        message: 'Unable to update user password',
      });
    }
  }

  async deleteOne(id) {
    // return an error response
    if (!id) {
      throw Boom.badRequest('No user ID provided');
    }

    try {
      // destroy the record in the database
      const [result] = await pool.query(
        'DELETE FROM Users WHERE id = ?',
        [id]
      );

      // if no rows were deleted, return an error
      if (result.affectedRows === 0) {
        throw Boom.notFound('User not found');
      }

      // return a success response
      return { status: 'DELETED SUCCESSFULLY' };
    } catch (err) {
      // return a Boom error if there's an exception deleting the record
      throw Boom.boomify(err, {
        message: 'Unable to delete user',
      });
    }
  }

  async listOne(id) {
    // return an error response
    if (!id) {
      throw Boom.badRequest('No user ID provided');
    }

    try {
      const [rows] = await pool.query(
        'SELECT * FROM Users WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        // return an error response
        throw Boom.notFound('User not found');
      }

      const theUser = rows[0];
      delete theUser.password;

      return theUser;
    } catch (err) {
      // return a Boom error if there's an exception finding the user
      throw Boom.boomify(err, {
        message: 'Unable to find user',
      });
    }
  }

  async listAll() {
    try {
      // save all records in the constant
      const [rows] = await pool.query(
        `SELECT id, userName, role, email, phone, address, registrationNumber,
                program, firstName, middleName, firstLastName, secondLastName
         FROM Users
         ORDER BY id ASC`
      );

      // if no records exist
      if (!rows.length) {
        return [];
      }

      return [...rows];
    } catch (err) {
      // return a Boom error if there's an exception finding all users
      throw Boom.boomify(err, {
        message: 'Unable to find users',
      });
    }
  }
}
