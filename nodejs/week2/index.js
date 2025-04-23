import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import configApps from "./src/configs/configApp";
// / Lấy đường dẫn hiện tại (tương tự __dirname trong CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 8000;

// Tạo một stream để ghi log vào file
const logStream = fs.createWriteStream(path.join(__dirname, "logs.log"), {
  flags: "a",
});
configApps(app, logStream);
// Cấu hình morgan để sử dụng format 'combined' và ghi vào log file

Router(app);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
