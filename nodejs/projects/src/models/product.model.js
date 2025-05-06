import pool from "../configs/configMysql.js";
import HttpError from "../interfaces/error.js";

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
      DT: {
        name,
        price,
        stock,
        description,
        category,
      },
    };
  } catch (error) {
    return {
      ST: 400,
      EC: 1,
      EM: error.message,
    };
  }
};
export const createIndexFulltextSearch = async (table, fields) => {
  try {
    // Tạo một chuỗi các trường để đưa vào trong câu lệnh SQL
    const fieldList = fields.join(", ");
    const query = `ALTER TABLE ${table} ADD FULLTEXT(${fieldList})`;
    // ALTER TABLE products ADD FULLTEXT(name, description);
    await pool.execute(query);
    console.log(
      `Full-text index đã được tạo cho bảng ${table} với các trường: ${fieldList}`
    );
  } catch (error) {
    console.error("Lỗi khi tạo Full-Text index:", error);
  }
};
export const deleteProductById = async (id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const queryOrderItems = `DELETE FROM order_items WHERE product_id = ?`;
    const dependeciesItems = [id];
    const [result] = await connection.execute(
      queryOrderItems,
      dependeciesItems
    );
    const selectQuery = `SELECT * FROM order_items WHERE product_id = ?`;
    const [rows] = await connection.execute(selectQuery, [id]);

    for (let item of rows) {
      const { order_id } = item;

      const queryOrder = `DELETE FROM orders WHERE id = ?`;
      const dependeciesOrder = [order_id];
      await connection.execute(queryOrder, dependeciesOrder);
    }

    const { affectedRows } = result;
    if (affectedRows <= 0) throw new HttpError(500, "Delete Failed");
    // DELETE FROM users WHERE id = 999;
    const query = `DELETE FROM products WHERE id = ?`;
    const dependecies = [id];
    await connection.execute(query, dependecies);

    await connection.commit();

    return {
      ST: 200,
      EC: 0,
      EM: "DELETE SUCCESS",
    };
  } catch (error) {
    await connection.rollback();
    return {
      ST: error.message | 400,
      EC: 1,
      EM: error.message,
    };
  } finally {
    connection.release();
  }
};
export const findProductById = async (productId) => {
  try {
    const query = "SELECT * FROM products WHERE id = ? LIMIT 1";
    const dependecies = [productId];
    const [rows] = await pool.execute(query, dependecies);

    const product = rows[0];

    if (!product) {
      return {
        ST: 404,
        EC: 1,
        EM: "Product Not Found",
      };
    } else {
      return {
        ST: 200,
        EC: 0,
        EM: "Find SUCCESS",
        DT: product,
      };
      //   console.log("Sản phẩm:", product);
    }
  } catch (error) {
    return {
      ST: 500,
      EC: 1,
      EM: "Server Error",
    };
  }
};
export const updateProduct = async ({
  id,
  name,
  price,
  stock,
  description,
  category,
}) => {
  try {
    const query = `UPDATE products 
    SET name = ?, price = ?, description = ? , stock= ? , category= ?
    WHERE id = ?`;
    const dependecies = [name, price, description, stock, category, id];
    // Câu lệnh UPDATE
    const [result] = await pool.execute(query, dependecies);
    const { affectedRows } = result;
    if (affectedRows <= 0) throw new HttpError(500, "Update Failed");
    return {
      ST: 200,
      EC: 0,
      EM: "Update SUCCESS",
    };
  } catch (error) {
    console.error(error);
    return {
      ST: error.message | 500,
      EC: 1,
      EM: "Server Error",
    };
  }
};
export default productModel;
