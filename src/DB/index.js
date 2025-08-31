// Import the createPool function from the mysql2/promise module
import { createPool } from "mysql2/promise";
// Import configuration settings
import { config } from "../config/config.js";

// Create a connections pool to the MySQL database
export const pool = createPool({
  // MySQl server address
  host: config.dbHost,
  // data base connection username
  user: config.dbUser,
  // data base connection password
  password: config.dbUserPassword,
  // MySQL engine port (3306 is default port)
  port: config.appPort || 3306,
  // data base schema name to connect
  database: config.dbName,
  // Queue connection requests if all are busy
  waitForConnections: true,
  // Max number of connections in the pool
  connectionLimit: 10,
  // Unlimited queued requests
  queueLimit: 0,
});
