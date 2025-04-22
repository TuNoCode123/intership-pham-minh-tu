import http from "http";
import Busboy from "busboy";
import fs from "fs/promises"; // Use promises for async file operations
import { createWriteStream } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import EventEmitter from "events";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create EventEmitter instance
const myEmitter = new EventEmitter();

// Handle upload completion logging
myEmitter.on("upload:done", async (content) => {
  const filePathLogs = path.join(__dirname, "uploads.log");
  try {
    await fs.appendFile(filePathLogs, `${content}\n`, "utf8");
    console.log("Logged upload to Uploads.log");
  } catch (err) {
    console.error("Error writing to log file:", err.message);
  }
});

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "Uploads");
async function ensureUploadDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
    console.log("Uploads directory ready");
  } catch (err) {
    console.error("Error creating uploads directory:", err.message);
  }
}

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === "/data" && req.method === "POST") {
    console.log("Received POST request to /data");
    console.log("Headers received:", req.headers);

    const busboy = Busboy({ headers: req.headers });

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      if (typeof filename === "object") {
        // Handle busboy's newer API where filename is an object
        filename = filename.filename;
      }

      const savePath = path.join(uploadDir, filename);
      const writeStream = createWriteStream(savePath);

      // lấy dữ liệu từ read stream từ client rồi ghi vào write stream
      file.pipe(writeStream);

      // Handle file stream errors
      file.on("error", (err) => {
        console.error(`Error reading file stream: ${err.message}`);
        writeStream.destroy(err);
      });

      // Handle write stream errors
      writeStream.on("error", (err) => {
        console.error(`Error writing file: ${err.message}`);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error saving file");
      });

      // Handle successful file write
      writeStream.on("finish", () => {
        myEmitter.emit(
          "upload:done",
          `File ${filename} uploaded successfully at ${new Date().toISOString()}`
        );
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`File ${filename} uploaded successfully!`);
      });
    });

    busboy.on("error", (err) => {
      console.error(`Busboy error: ${err.message}`);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error processing upload");
    });

    busboy.on("finish", () => {
      console.log("Busboy finished processing");
    });

    // Pipe request to busboy
    req.pipe(busboy);
  } else {
    // Handle non-POST or incorrect URL
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

// Start server
async function startServer() {
  await ensureUploadDir();
  server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });

  // Handle server errors
  server.on("error", (err) => {
    console.error(`Server error: ${err.message}`);
  });
}

// Execute server start
startServer();
