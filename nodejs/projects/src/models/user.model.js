import pool from "../configs/configMysql.js";
import "dotenv/config";
import { hashPassWord } from "../helpers/bcryptPass.js";

async function userModal() {
  try {
    // Explicitly select the database
    // await pool.execute(`USE \`${dbName}\``);

    const query = `
      CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  revork BOOLEAN DEFAULT FALSE,
  accessVersion INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `;

    await pool.execute(query);
    console.log("Created users table.");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
}
export const getUserByEmail = async (email) => {
  try {
    const [rs] = await pool.query("SELECT * FROM users where email=?", [email]);
    return {
      EC: 0,
      DT: rs,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
    };
  }
};
export const insertUser = async ({ password, ...user }) => {
  try {
    const { name, email, role } = user;
    const sql =
      "INSERT INTO users (name, email, password,role, created_at) VALUES (?, ?, ?, ?, ?)";
    const hashPass = hashPassWord(password);
    const values = [name, email, hashPass, role, new Date()];
    //   console.log(name, email, hashPass, role, new Date());
    const [result] = await pool.execute(sql, values);
    const { affectedRows } = result;
    console.log("----->", affectedRows);
    return {
      EC: 0,
      DT: affectedRows,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
    };
  }
};
export default userModal;
