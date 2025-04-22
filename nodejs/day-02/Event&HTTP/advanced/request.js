import http from "http";
import FormData from "form-data";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises"; // Use promises for async file operations
import { createReadStream } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function uploadFile() {
  try {
    // Construct file path
    const filePath = path.join(__dirname, "test.txt");
    console.log("File path:", filePath);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`File not found at: ${filePath}`);
    }

    // Create FormData
    const form = new FormData();
    form.append("file", createReadStream(filePath), "test.txt");

    // HTTP request options
    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/data",
      method: "POST",
      headers: form.getHeaders(),
    };

    // Create HTTP request
    const req = http.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);

      let responseData = "";
      res.setEncoding("utf8");

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        console.log("Response:", responseData);
        console.log("Upload completed.");
      });
    });

    // Handle request errors
    req.on("error", (error) => {
      console.error(`Request error: ${error.message}`);
    });

    // Pipe form data to request
    form.pipe(req);

    // Ensure request is properly ended
    req.on("finish", () => {
      console.log("Request sent successfully");
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Execute upload
uploadFile();
