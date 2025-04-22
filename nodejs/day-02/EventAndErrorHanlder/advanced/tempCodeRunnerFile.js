// app.js
import express from "express";

const app = express();
const PORT = 3000;

// Middleware để parse JSON
app.use(express.json());

// Route đơn giản
app.get("/", (req, res, next) => {
  try {
    console.log(a);
    res.send("Hello World!");
  } catch (error) {
    next(error); // Gọi next() với lỗi để chuyển đến middleware xử lý lỗi
  }
});
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something broke!");
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
