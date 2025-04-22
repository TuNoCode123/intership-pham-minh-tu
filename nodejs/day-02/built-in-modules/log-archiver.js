import { promises as fs } from "fs";
import { promisify } from "util";
import { gzip } from "zlib";
import AdmZip from "adm-zip";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// / Lấy đường dẫn hiện tại (tương tự __dirname trong CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LOGS_DIR = path.join(__dirname, "logs"); //folder logs
const ARCHIVES_DIR = path.join(__dirname, "archives"); //folder ẢchiverẢchiver
const gzipAsync = promisify(gzip);

// Tạo các thư mục logs và archives nếu chưa tồn tại
const ensureDirectories = async () => {
  try {
    await Promise.all([
      fs.mkdir(LOGS_DIR, { recursive: true }),
      fs.mkdir(ARCHIVES_DIR, { recursive: true }),
    ]);
  } catch ({ message }) {
    console.error(`Error creating directories: ${message}`);
    process.exit(1);
  }
};

// đọc tất cả các file +folder trong thư mục logs và lọc ra các file có ending là .log
const getLogFiles = async () => {
  try {
    // fs.readdir là một hàm bất đồng bộ (asynchronous) trong Node.js, được sử dụng để đọc nội dung của một thư mục.
    const files = await fs.readdir(LOGS_DIR);
    return files.filter((file) => file.endsWith(".log"));
  } catch ({ message }) {
    console.error(`Error reading logs directory: ${message}`);
    process.exit(1);
  }
};

// format data thời điểm hiện tại ở Việt NAM theo chuẩn YYYYMMDD_HHMM
const formatDateTime = (date) => {
  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `log_${year}${month}${day}_${hours}${minutes}.log`;
};

// rename các file log theo định dạng YYYYMMDD_HHMM.log
const renameLogFiles = async (logFiles) => {
  const renamedFiles = [];
  for (const file of logFiles) {
    const filePath = path.join(LOGS_DIR, file);
    try {
      //  dùng để lấy thông tin chi tiết về một file hoặc thư mục.
      const { mtime } = await fs.stat(filePath);
      // for example:   mtime: 2025-04-22T06:10:30.000Z,
      const newFileName = formatDateTime(mtime);
      const newFilePath = path.join(LOGS_DIR, newFileName);
      await fs.rename(filePath, newFilePath);
      // ghi vào mảng đánh dấu là đã đổi tên để xíu thêm vào file zip
      renamedFiles.push({
        original: file,
        new: newFileName,
        path: newFilePath,
      });
    } catch ({ message }) {
      console.error(`Error renaming ${file}: ${message}`);
    }
  }
  return renamedFiles;
};

// nén các file log đã đổi tên vào trong một file zip
const createZipArchive = async (renamedFiles) => {
  const zip = new AdmZip();
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 14);
  const zipFileName = `logs_${timestamp}.zip`;
  const zipFilePath = path.join(ARCHIVES_DIR, zipFileName);
  try {
    for (const { new: fileName, path: filePath } of renamedFiles) {
      try {
        const content = await fs.readFile(filePath);
        //   nén nội dung của file log bằng gzip
        const compressed = await gzipAsync(content);

        //   thêm một file vào trong file ZIP, với các thông tin như sau:
        //   fileName: Đây là tên của file bạn muốn thêm vào archive (tệp ZIP)
        //   compressed: Đây là dữ liệu đã được nén (compressed data).
        zip.addFile(fileName, compressed);
      } catch ({ message }) {
        console.error(`Error compressing ${fileName}: ${message}`);
      }
    }
  } catch (error) {
    console.error(`Error adding files to zip: ${error.message}`);
    process.exit(1);
  }

  try {
    // ghi file zip vào thư mục archives
    zip.writeZip(zipFilePath);
    console.log(`Archive created: ${zipFilePath}`);
  } catch ({ message }) {
    console.error(`Error creating zip archive: ${message}`);
    process.exit(1);
  }
};

const main = async () => {
  await ensureDirectories();
  const logFiles = await getLogFiles();

  if (!logFiles.length) {
    console.log("No .log files found in /logs directory.");
    return;
  }

  console.log(`Found ${logFiles.length} .log files.`);
  const renamedFiles = await renameLogFiles(logFiles);

  if (!renamedFiles.length) {
    console.log("No files were renamed successfully.");
    return;
  }

  await createZipArchive(renamedFiles);
  console.log("Log archiving completed.");
};

main().catch(({ message }) => {
  console.error(`Unexpected error: ${message}`);
  process.exit(1);
});
