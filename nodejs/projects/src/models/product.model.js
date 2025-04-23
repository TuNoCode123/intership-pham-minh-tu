import pool from "../configs/configMysql.js";

async function productModel() {
  try {
    const query = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      stock INT DEFAULT 0,
      description TEXT,
      category VARCHAR(255),
      INDEX idx_name_category (name, category)
    )
  `;

    await pool.execute(query);
    console.log("Created products table.");
  } catch (error) {
    console.error("Error creating products table:", error.message);
  }
}
export const addProductModal = async (product) => {
  try {
    const { name, price, stock, description, category } = product;
    const query = `
        INSERT INTO products (name, price, stock, description, category)
        VALUES (?, ?, ?, ?, ?)
      `;
    const dependenceis = [name, price, stock, description, category];
    await pool.execute(query, dependenceis);
    return {
      ST: 200,
      EC: 0,
      EM: "ADD PRODUCT SUCCESS",
    };
  } catch (error) {
    return {
      ST: 400,
      EC: 1,
      EM: error.message,
    };
  }
};

export default productModel;
