import { Transform } from "stream";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
// / Lấy đường dẫn hiện tại (tương tự __dirname trong CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Tạo Transform stream đổi chữ thành chữ hoa
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    const upperChunk = chunk.toString().toUpperCase();
    // Chuyển đổi chunk thành chữ hoa
    this.push(upperChunk);
    // Gọi callback để báo hiệu rằng quá trình xử lý đã hoàn tất
    callback();
  },
});

// Đọc file rồi đổi chữ thành chữ hoa

fs.createReadStream(path.join(__dirname, "input.txt"))
  .pipe(upperCaseTransform)
  .pipe(fs.createWriteStream(path.join(__dirname, "output.txt")))
  .on("finish", () => {
    console.log("Đã ghi chữ hoa vào output.txt");
  });
