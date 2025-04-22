const tasks = [
  {
    id: 1,
    deadline: new Date("2024-04-22"),
    status: "completed",
  },
  {
    id: 2,
    deadline: new Date("2024-04-22"),
    status: "completed",
  },
  {
    id: 3,
    deadline: new Date("2024-04-22"),
    status: "completed",
  },
  {
    id: 4,
    deadline: new Date("2024-04-22"),
    status: "completed",
  },
];
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

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const getMaxId = (tasks) => {
  return (
    tasks.reduce((max, item) => {
      return item.id > max ? item.id : max;
    }, 0) + 1
  );
};
// Middleware để parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware để parse URL-encoded data

//middleware kiem tra token
app.use((req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
});
// get task by criteria or id
app.get("/task", (req, res, next) => {
  try {
    const { status, id } = req.query;
    if (!status && !id) {
      return res.status(200).json(tasks);
    }
    const taskTarget = tasks.filter(
      (item) => item.status == status || item.id == id
    );
    return res.status(200).json(taskTarget); // Trả về danh sách người dùng
  } catch (error) {
    if ((error.status = 404)) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
    next(new HttpError(500, error)); // Gọi next() với lỗi để chuyển đến middleware xử lý lỗi
  }
});

// delete task by Id
app.delete("/task", (req, res, next) => {
  try {
    const { id } = req.query;
    if (!id) throw new HttpError(404, "id is missing");
    const indexTargetItem = tasks.findIndex((item) => item.id == id);
    console.log(indexTargetItem);
    if (indexTargetItem == -1) {
      throw new HttpError(404, "task not found");
    }
    tasks.splice(indexTargetItem, 1);
    console.log(tasks);
    return res.status(200).json({
      message: "Xóa thành công",
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

// add task by Id
app.post("/task", (req, res, next) => {
  try {
    const { deadline, status } = req.body;
    if (!deadline || !status) throw new HttpError(404, "data is missing");
    const maxid = getMaxId(tasks);
    console.log(maxid);
    tasks.push({
      id: maxid,
      deadline: new Date(deadline),
      status,
    });

    return res.status(200).json({
      message: "Thêm thành công",
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

// update task by Id
app.put("/task", (req, res, next) => {
  try {
    const { id, deadline, status } = req.body;
    if (!id || !deadline || !status)
      throw new HttpError(404, "data is missing");
    const indexTargetItem = tasks.findIndex((item) => item.id == id);
    if (indexTargetItem == -1) {
      throw new HttpError(404, "task not found");
    }
    tasks[indexTargetItem].deadline = new Date(deadline);
    tasks[indexTargetItem].status = status;

    return res.status(200).json({
      message: "update thành công",
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

setInterval(() => {
  const currentDate = new Date();
  const itemsExpireIndex = tasks.findIndex(
    (item) => item.deadline > currentDate && item.Date != "overdue"
  );
  if (itemsExpireIndex >= 0) {
    tasks[itemsExpireIndex].status = "overdue";
  }
}, 1000);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
