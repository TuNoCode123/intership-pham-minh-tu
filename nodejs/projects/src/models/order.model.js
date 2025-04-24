import pool from "../configs/configMysql.js";
import HttpError from "../interfaces/error.js";

async function orderModel() {
  try {
    const query = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      status ENUM('pending', 'paid', 'shipped', 'cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;

    await pool.execute(query);
    console.log("Created orders table.");
  } catch (error) {
    console.error("Error creating orders table:", error.message);
  }
}
export const insertOrder = async (order, connection) => {
  try {
    const query = `INSERT INTO orders (user_id, total_price, status, created_at)
         VALUES (?, ?, ?, ?)`;
    const dependecies = [
      order.user_id,
      order.total_price,
      order.status,
      new Date(),
    ];
    const [result] = await connection.query(query, dependecies);
    const { affectedRows, insertId } = result;
    if (affectedRows <= 0) throw new HttpError(500, "Insert Order Failed");
    return {
      ST: 200,
      EC: 0,
      EM: "Insert Order SUCCESS",
      DT: insertId,
    };
  } catch (error) {
    return {
      ST: error.status | 500,
      EC: 1,
      EM: error.message,
    };
  }
};
export default orderModel;
