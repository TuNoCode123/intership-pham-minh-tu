import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// / Lấy đường dẫn hiện tại (tương tự __dirname trong CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Hàm lấy giờ theo múi giờ 'Asia/Ho_Chi_Minh'
function getVietnamTime() {
  const now = new Date();
  const vietnamTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  // Format lại cho giống 'YYYY-MM-DD HH:mm:ss'
  const [date, time] = vietnamTime.split(", ");
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day} ${time}`;
}

const timestamp = getVietnamTime();
const logMessage = `Hello at ${timestamp}\n`;

fs.appendFile(path.join(__dirname, "log.txt"), logMessage, (err) => {
  if (err) {
    console.error("Không thể ghi vào file log.txt:", err);
  } else {
    console.log(`Đã ghi: ${logMessage} vào log.txt`);
  }
});
