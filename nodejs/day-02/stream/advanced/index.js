import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
import { Transform } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replaceData = new Transform({
  transform(chunk, encoding, callback) {
    // Kết hợp chunk mới với dữ liệu còn lại từ lần trước
    this.lastChunk = this.lastChunk ? this.lastChunk + chunk : chunk.toString();
    // Thực hiện thay thế "ERROR" thành "⚠️ Warning"
    const updatedData = this.lastChunk.replace(/ERROR/g, "⚠️ Warning");
    this.push(updatedData); // Đẩy dữ liệu đã thay thế vào luồng tiếp theo

    // Đảm bảo không mất đi phần dữ liệu không đầy đủ
    this.lastChunk = updatedData.slice(
      updatedData.lastIndexOf("ERROR") + "⚠️ Warning".length
    );
    callback();
  },
});
const readStream = fs.createReadStream(path.join(__dirname, "input.txt"));
const writeStream = fs.createWriteStream(path.join(__dirname, "output.txt"));

readStream
  .pipe(replaceData)
  .pipe(writeStream)
  .on("finish", () => {
    console.log("successfully transformed and saved to output.txt");
  });
