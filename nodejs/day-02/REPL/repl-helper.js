// repl-helper.js
import repl from "repl";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// / Lấy đường dẫn hiện tại (tương tự __dirname trong CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Tạo REPL server mới
const myRepl = repl.start({
  prompt: "MyREPL > ", // Đổi dấu nhắc
  useColors: true, // Cho màu mè tí cho đẹp
  historySize: 1000, // Lưu 1000 lệnh trong lịch sử
  terminal: true, // Đảm bảo sử dụng terminal
});

// Thêm biến hoặc hàm custom vào context
myRepl.context.sayHi = function (name) {
  return `Hi ${name}!`;
};

myRepl.context.now = function () {
  return new Date().toLocaleString();
};

// Autocomplete custom functions: sayHi, now, sum(a,b)
myRepl.completer = function (line) {
  const completions = ["sayHi", "now", "sum(a,b)", ".exit", ".save", ".help"];
  const hits = completions.filter((cmd) => cmd.startsWith(line));
  return [hits, line];
};
// myRepl.completer = function (line) {
//   const completions = ["sayHi", "now", "sum(a,b)", ".exit", ".save", ".help"];
//   const hits = completions.filter((cmd) => cmd.startsWith(line));
//   return [hits, line];
// };

// Lưu lịch sử khi dùng .save
myRepl.defineCommand("save", {
  help: "Save REPL history to a file",
  action() {
    const historyFilePath = path.join(__dirname, "history.txt");
    fs.writeFileSync(historyFilePath, myRepl.lines.join("\n"), "utf8");
    console.log("History saved to history.txt");
    this.displayPrompt();
  },
});
myRepl.context.version = "1.0.0";
// Kết thúc
myRepl.on("exit", () => {
  console.log("REPL has exited");
  process.exit(0);
});
