import pool from "../configs/configMysql.js";

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

export default orderModel;
