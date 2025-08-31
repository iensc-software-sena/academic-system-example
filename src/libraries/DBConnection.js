import { pool } from "../DB/index.js";

export const testConnection = async () => {
  try {
    // get one connection from the pool
    const connection = await pool.getConnection();
    // test connection with a simple ping
    await connection.ping();
    console.log("✅ Connection to the database has been established successfully.");
    // release the connection back to the pool
    connection.release();
  } catch (err) {
    console.error("❌ Impossible to connect to the database:", err.message);
  }
};
