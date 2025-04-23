const faker = require("faker");
const pool = require("./db");

// Fake data cho bảng users
const fakeUsers = Array.from({ length: 5 }, () => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: faker.random.arrayElement(["user", "admin"]),
  created_at: faker.date.past(),
}));

// Fake data cho bảng products
const fakeProducts = Array.from({ length: 5 }, () => ({
  name: faker.commerce.productName(),
  price: faker.commerce.price(),
  stock: faker.datatype.number({ min: 1, max: 100 }),
  description: faker.commerce.productDescription(),
  category: faker.commerce.department(),
}));

// Fake data cho bảng orders
const fakeOrders = Array.from({ length: 5 }, () => ({
  user_id: faker.random.arrayElement(fakeUsers).user_id,
  total_price: faker.commerce.price(),
  status: faker.random.arrayElement([
    "pending",
    "paid",
    "shipped",
    "cancelled",
  ]),
  created_at: faker.date.past(),
}));

// Fake data cho bảng order_items
const fakeOrderItems = Array.from({ length: 5 }, () => ({
  order_id: faker.random.arrayElement(fakeOrders).order_id,
  product_id: faker.random.arrayElement(fakeProducts).id,
  quantity: faker.datatype.number({ min: 1, max: 5 }),
  price: faker.commerce.price(),
}));

// Hàm chèn dữ liệu vào database
async function insertData() {
  try {
    // Chèn dữ liệu vào bảng users
    for (const user of fakeUsers) {
      const [result] = await pool
        .promise()
        .query(
          "INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)",
          [user.name, user.email, user.password, user.role, user.created_at]
        );
      user.user_id = result.insertId; // Lưu lại user_id để sử dụng trong bảng orders
    }

    // Chèn dữ liệu vào bảng products
    for (const product of fakeProducts) {
      await pool
        .promise()
        .query(
          "INSERT INTO products (name, price, stock, description, category) VALUES (?, ?, ?, ?, ?)",
          [
            product.name,
            product.price,
            product.stock,
            product.description,
            product.category,
          ]
        );
    }

    // Chèn dữ liệu vào bảng orders
    for (const order of fakeOrders) {
      await pool
        .promise()
        .query(
          "INSERT INTO orders (user_id, total_price, status, created_at) VALUES (?, ?, ?, ?)",
          [order.user_id, order.total_price, order.status, order.created_at]
        );
    }

    // Chèn dữ liệu vào bảng order_items
    for (const orderItem of fakeOrderItems) {
      await pool
        .promise()
        .query(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [
            orderItem.order_id,
            orderItem.product_id,
            orderItem.quantity,
            orderItem.price,
          ]
        );
    }

    console.log("Fake data has been inserted successfully!");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    pool.end();
  }
}

// Chạy hàm insertData để tạo và chèn dữ liệu
// insertData();
