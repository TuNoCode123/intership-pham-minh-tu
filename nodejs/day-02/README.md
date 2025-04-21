# My Internship Project

1, REPL là gì?

- là một môi trường tương tác, nơi bạn có thể gõ từng dòng lệnh, thực thi ngay lập tức và xem kết quả liền.
- cực kỳ hữu ích khi bạn muốn thử nghiệm nhanh một đoạn code, kiểm tra ý tưởng, hoặc debug mà không cần phải tạo file riêng.

REPL viết tắt của

- Read: Đọc một dòng input mà bạn nhập vào.
- Eval: Đánh giá (evaluate) dòng đó (tức là thực thi nó).
- Print: In ra kết quả của quá trình thực thi.
- Loop: Quay lại và tiếp tục chờ bạn nhập lệnh mới.

Cú pháp của REPL
Lệnh Ý nghĩa
.help Hiển thị tất cả lệnh REPL hỗ trợ
.exit Thoát khỏi REPL
.clear Xóa hết biến đang lưu trong REPL
.save filename Lưu session hiện tại vào file
.load filename Tải file vào session REPL
.editor bật mode viết nhiều dòng code

2,Command line
a, Làm sao nhận input từ process.argv?

- process.argv là một mảng (Array) chứa các đối số (arguments) được truyền từ command line khi bạn chạy file Node.
  Vị trí | Ý nghĩa
  0 | Đường dẫn tới node.exe
  1 | Đường dẫn tới file .js bạn đang chạy
  2 trở đi | Các đối số bạn truyền vào

- Giả sử bạn có file app.js
  console.log(process.argv);
- Chạy trên terminal:
  node app.js hello world 123
  -->Kết quả in ra:
  [
  '/usr/local/bin/node',
  '/path/to/your/app.js',
  'hello',
  'world',
  '123'
  ]
  --->Từ đây bạn có thể lấy input bằng destructuring [nodePath,AppPath,...restArgs] hoặc sử dụng
  arr.slice(2)
  b, Khác biệt giữa stdout(standard output) và stderr(standard error)?

  - stdout là nơi chương trình ghi ra dữ liệu thành công và Redirect bằng >.
    Ví dụ: in ra kết quả tính toán, danh sách file, thông báo OK...
    là các hàm console.log, console.info
  - stderr là nơi chương trình ghi ra dữ liệu lỗi và Redirect bằng 2>.
    Ví dụ: lỗi file không tồn tại, lỗi permission, lỗi network...
    là các hàm console.error, console.warn

  Cả hai đều là Writable Stream trong Node.js và xuất hiện trên console, nhưng về kỹ thuật thì Bạn có thể redirect chúng riêng biệt.
  Ví dụ:

  - Chỉ lưu kết quả (stdout) vào file.
  - Chỉ lưu lỗi (stderr) vào file khác.

  Ví dụ trong Node.js:
  // Ghi ra stdout
  process.stdout.write('This is normal output\n');

  // Ghi ra stderr
  process.stderr.write('This is error output\n');

  Chạy sẽ thấy:
  This is normal output
  This is error output

  Đều hiện ra console. Nhưng nếu bạn redirect:
  node app.js > out.txt 2> err.txt
  thì

  - > redirect stdout vào out.txt
  - 2> redirect stderr vào err.txt

c, Cách dùng readline?
1, stdin là gì?

- là một Readable Stream(Đọc dữ liệu người dùng hoặc input từ file).
- Mặc định ở chế độ paused(Dừng đọc) cần .resume() hoặc lắng nghe sự kiện để Bắt đầu đọc.

Một số thuộc tính & method hay dùng:
Thuộc tính/method | Ý nghĩa
process.stdin.resume() | Bắt đầu đọc
process.stdin.pause() | Dừng đọc
process.stdin.setEncoding('utf8') | Chuyển dữ liệu thành text (mặc định là buffer)
process.stdin.on('data', callback) | Đọc từng mẩu dữ liệu
2, readline là gì?

- là bất đồng bộ(Nó đăng ký callback và tiếp tục chạy các code khác).
- readline là module có sẵn trong Node.js.
- Dùng để đọc input từ user (qua stdin), kiểu hỏi và trả lời.
- Thường dùng cho: tạo CLI tool, form nhập liệu trên terminal, hỏi người dùng...

  Các bước cơ bản để dùng readline
  1, Import readline:
  const readline = require('readline');--->muốn dùng theo kiểu callback(dễ gây ra callback hell)
  const readline = require('readline/promises'); ---> muốn dùng với async/await
  2, Tạo interface
  const rl = readline.createInterface({
  input: process.stdin, // lấy dữ liệu từ bàn phím
  output: process.stdout // in ra console
  });
  3, Hỏi user bằng question():
  //cách 1
  rl.question('Bạn tên gì? ', (answer) => {
  console.log(`Chào bạn, ${answer}!`);
  rl.close(); // Đóng readline sau khi xong
  //cách 2
  async function temp() {
  const name = await rl.question('Bạn tên gì? ');
  const age = await rl.question('Bạn bao nhiêu tuổi? ');
  console.log(`Chào ${name}, bạn ${age} tuổi.`);
  rl.close();
  }
    <!-- Nhớ rl.close() sau khi xong, nếu không process sẽ bị treo chờ mãi. -->

  });
