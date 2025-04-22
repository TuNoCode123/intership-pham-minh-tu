import EventEmitter from "events"; // Import EventEmitter

// Tạo một instance của EventEmitter
const myEmitter = new EventEmitter();

myEmitter.on("enterAgain", () => {
  console.log("Nhập lại đi nào!");
  myEmitter.emit("sum", 1, 2, 3, 4);
});
// Đăng ký một listener cho một sự kiện
myEmitter.on("sum", (...rest) => {
  if (rest.filter((item) => typeof item != "number").length > 0) {
    console.log("Vui lòng nhập số!");
    myEmitter.emit("enterAgain");
    return;
  } else if (rest.length === 0) {
    myEmitter.emit("sum", 1, 2, 3); // Phát sự kiện 'greet' với tham số "John"
  } else {
    console.log(`Sum is, ${rest.reduce((a, b) => a + b, 0)}!`);
  }
});

// Phát sự kiện 'greet' và truyền tham số vào
myEmitter.emit("sum", "12", 1, 2, 3); // Kết quả: Hello, John!
