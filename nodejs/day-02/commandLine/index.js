// Làm sao nhận input từ process.argv
// [
//   "/path/to/node", // process.argv[0]: Đường dẫn đến Node.js
//   "/path/to/app.js", // process.argv[1]: Đường dẫn đến file script
// ...rest : các đối số cảu người dùng ghi vào
// ];
const [pathNode, PathJsFile, ...restArgs] = process.argv;
// console.log("Đường dẫn đến Node.js:", pathNode); // Đường dẫn đến Node.js
process.stdout.write("Đường dẫn đến Node.js: " + pathNode + "\n"); // Đường dẫn đến Node.js
// Ghi ra stderr (thông báo lỗi)
process.stderr.write("Đây là thông báo stderr\n");
console.error("fkdashfkjdsahf");
