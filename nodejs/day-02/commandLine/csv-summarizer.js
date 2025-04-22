import fs from "fs";
import csv from "csv-parser";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const [pathNode, PathJsFile, ...restArgs] = process.argv;
if (restArgs.length !== 1) {
  console.error(`Usage: node ${PathJsFile} <data.csv>`);
  process.exit(1);
}

const inputFile = process.argv[2];
const results = [];
const sums = {};
const counts = {};
const numericColumns = new Set();
// Tạo một stream để đọc file data.csv trong thư mục hiện tại (__dirname).
fs.createReadStream(path.join(__dirname, inputFile))
  .pipe(csv()) //Dùng thư viện csv để parse dữ liệu từ file CSV: vd: Tự động biến từng dòng CSV thành object kiểu {header1: value1, header2: value2}.
  .on("headers", (headers) => {
    //Lắng nghe sự kiện headers, khi csv() đọc được dòng tiêu đề (dòng đầu tiên của file).
    //headers là mảng chứa tên các cột, ví dụ: [id,score1,score2,score3].
    headers.forEach((header) => {
      // Khởi tạo ban đầu cho mỗi cột:
      //Với mỗi header, tạo biến sums[header] để cộng tổng giá trị số.
      sums[header] = 0;
      //Tạo thêm counts[header] để đếm số lượng giá trị số.
      counts[header] = 0;
    });
  })
  .on("data", (row) => {
    //Lắng nghe sự kiện "data", tức là mỗi dòng dữ liệu mới được đọc.
    //row là object kiểu {id: "1", score1: "80", score2: "90" , score3: "70" }
    // Lưu từng dòng dữ liệu vào mảng results để sau này bạn có thể dùng lại.
    results.push(row);
    // lấy key trả về một mảng gồm các key và loop qua từng key
    Object.keys(row).forEach((key) => {
      // giá trị của từng key
      const value = parseFloat(row[key]);
      //   Kiểm tra nếu ô đó thực sự là số (value không phải NaN).
      if (!isNaN(value)) {
        // Ghi nhận cột này là một cột số, bằng cách thêm vào Set numericColumns.
        numericColumns.add(key);
        sums[key] += value;
        counts[key]++;
      }
    });
  })
  .on("end", () => {
    //  // ket thuc doc row
    const table = [];
    numericColumns.forEach((col) => {
      const sum = sums[col];
      const count = counts[col];
      const avg = count > 0 ? (sum / count).toFixed(2) : "N/A";
      table.push({ Column: col, Sum: sum.toFixed(2), Average: avg });
    });

    // console.table(table); // tương đương với stdOut

    // In header
    process.stdout.write(`|------------------|------------|------------|\n`);
    process.stdout.write(`| Column           | Sum        | Average    |\n`);
    process.stdout.write(`|------------------|------------|------------|\n`);

    // In từng dòng
    table.forEach(({ Column, Sum, Average }) => {
      const line = `| ${Column.padEnd(16)} | ${Sum.toString().padEnd(
        10
      )} | ${Average.toString().padEnd(10)} |\n`;
      process.stdout.write(line);
    });
    process.stdout.write(`|------------------|------------|------------|\n`);
  })
  .on("error", (err) => {
    console.error("Error reading file:", err.message);
    process.exit(1);
  });
