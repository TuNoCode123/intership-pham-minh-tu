import express from "express";
import fs from "fs";
import configApps from "./src/configs/configApp.js";
import Router from "./src/routers/index.js";
import setupDatabase from "./src/models/index.js";
import morgan from "morgan";
const app = express();
const PORT = 8000;
import cors from "cors";
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // nếu dùng cookie hoặc header authentication
  })
);
// middleware morgan
app.use(morgan("dev"));

// Tạo một stream để ghi log vào file
const logStream = fs.createWriteStream("access.log", {
  flags: "a",
});
configApps(app, logStream);
// Cấu hình morgan để sử dụng format 'combined' và ghi vào log file

Router(app);
//setup db
setupDatabase();
// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
