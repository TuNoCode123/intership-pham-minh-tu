import http from "http";

// Tạo server
const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        message: "Chào mừng bạn đến với trang chủ",
        timestamp: new Date().toISOString(),
      })
    );
  } else if (req.url === "/data" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // Chuyển đổi Buffer thành chuỗi
    });
    req.on("end", () => {
      const { name, age } = JSON.parse(body);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          message: "Dữ liệu đã nhận",
          data: {
            name: name,
            age: age + 80,
          },
        })
      );
    });
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Không tìm thấy\n");
  }
});

// Server lắng nghe ở cổng 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server đang chạy ở http://localhost:${PORT}`);
});
