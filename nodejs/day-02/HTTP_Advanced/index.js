// app.js
import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// / Lấy đường dẫn hiện tại (tương tự __dirname trong CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 8000;
const user = [
  {
    id: 1,
    name: "fdlasfhjdlkash",
    age: 500,
  },
];
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Middleware để parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware để parse URL-encoded data

// get user by id
app.get("/user/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new HttpError(404, "id is missing");
    const userTarget = user.find((item) => item.id == id);
    if (!userTarget) throw new HttpError(404, "user not found");
    return res.status(200).json(user); // Trả về danh sách người dùng
  } catch (error) {
    if ((error.status = 404)) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
    next(new HttpError(500, error)); // Gọi next() với lỗi để chuyển đến middleware xử lý lỗi
  }
});

const getMaxId = (user) => {
  return (
    user.reduce((max, item) => {
      return item.id > max ? item.id : max;
    }, 0) + 1
  );
};
// add user
app.post("/user", (req, res, next) => {
  try {
    const { name, age } = req.body;
    if (!name || !age) throw new HttpError(404, "missing input");
    const id = getMaxId(user);
    user.push({
      id,
      name,
      age,
    });
    return res.status(200).json({
      message: "Thêm người dùng thành công",
      data: user,
      errCode: 0,
    }); // Trả về danh sách người dùng
  } catch (error) {
    if ((error.status = 404)) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
    next(new HttpError(500, error)); // Gọi next() với lỗi để chuyển đến middleware xử lý lỗi
  }
});

// Route với lỗi 404
app.use((req, res, next) => {
  next(new HttpError(404, "Không tìm thấy url này!")); // Gọi next() với lỗi để chuyển đến middleware xử lý lỗi
});
//router lỗi chung
app.use((err, req, res, next) => {
  try {
    // ghi loi
    const errPath = path.join(__dirname, "error.log");
    if (!fs.existsSync(errPath)) {
      fs.writeFileSync(errPath, ""); // Tạo file rỗng nếu không có
    }
    fs.createWriteStream(errPath, { flags: "a" }).write(
      `${new Date().toISOString()} - ${err.message} - status: ${
        err.status || 500
      }\n`
    );
    if (process.env.NODE_ENV !== "production") {
      console.error(err); // Ghi lỗi vào console nếu không phải môi trường sản xuất
      return res.status(err.status || 500).json({
        message: err.message,
        stack: err.stack, // Gửi thông tin stack trace nếu không phải môi trường sản xuất
      });
    } else {
      return res.status(err.status || 500).json({
        message: err.message,
        status: err.status || 500,
      });
    }
  } catch (error) {
    console.error("Lỗi ghi log:", error); // Ghi lỗi vào console nếu không thể ghi vào file
    res.status(500).send("Đã xảy ra lỗi khi xử lý yêu cầu của bạn."); // Gửi thông báo lỗi chung
  }
});
// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
