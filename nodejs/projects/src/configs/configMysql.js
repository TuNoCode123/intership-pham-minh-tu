import mysql from "mysql2/promise";
import "dotenv/config";
// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "root",
  database: process.env.DB_NAME ?? "miniProject",
  password: process.env.DB_PASSWORD ?? "123456",
  port: process.env.DB_PORT ?? 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 300000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true, // Giúp giữ kết nối lâu dài, giảm lỗi timeout.  client sẽ gửi một gói tin nhỏ đến server để giữ cho kết nối không bị cắt.
  keepAliveInitialDelay: 0, //Sau khi TCP kết nối thành công, đợi bao lâu trước khi gửi gói tin Keep-Alive đầu tiên.
});
pool.on("acquire", (connection) => {
  console.log("Kết nối đến DB đã được lấy!");
  // Xử lý sự kiện kết nối tại đây
});
pool.on("release", (connection) => {
  console.log("Kết nối đến DB đã được giải phóng!");
  // Xử lý sự kiện giải phóng kết nối tại đây
});
pool.on("error", (err) => {
  console.error("Lỗi kết nối đến DB:", err);
  // Xử lý lỗi kết nối tại đây
});
pool.on("connection", (connection) => {
  console.log("Kết nối đến DB thành công!");
  // Xử lý sự kiện kết nối tại đây
});

export default pool;
