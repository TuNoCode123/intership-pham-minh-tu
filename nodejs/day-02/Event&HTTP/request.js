import http from "http";

const options = {
  hostname: "localhost", // KHÔNG có http://
  port: 3000, // cổng đúng (vì server bạn chạy 3000 mà)
  //   path: "/", // đường dẫn
  //   method: "GET", // phương thức
  path: "/data",
  method: "POST", // Gửi dữ liệu, nên chọn POST hoặc PUT
  headers: {
    "Content-Type": "application/json", // Định dạng JSON
  },
};

// Dữ liệu muốn gửi lên server
const postData = JSON.stringify({
  name: "John",
  age: 30,
});
const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);

  res.setEncoding("utf8");
  res.on("data", (chunk) => {
    console.log(`Dữ liệu nhận được: ${chunk}`);
  });

  res.on("end", () => {
    console.log("Phản hồi hoàn tất.");
  });
});

req.write(postData); // Gửi dữ liệu

// Nếu có lỗi
req.on("error", (e) => {
  console.error(`Có lỗi xảy ra: ${e.message}`);
});

// Chưa gọi end() thì request sẽ không được gửi đi
req.end(); // Gọi end() để kết thúc và gửi request đi
