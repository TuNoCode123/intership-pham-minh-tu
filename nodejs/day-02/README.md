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

d, dependencies vs devDependencies?

Khi bạn làm việc với package.json, có hai loại thư viện chính:

- dependencies

  - Những thư viện bắt buộc phải cài để ứng dụng chạy được.
  - Chạy app, build app, deploy app đều cần. Ví dụ: express, react, axios, lodash, ...
  - Khi bạn cài:
    - npm install express ----> thì nó tự vào dependencies.

- devDependencies

  - Những thư viện chỉ cần cho quá trình phát triển, không cần khi chạy ứng dụng thật. Ví dụ: typescript, eslint, prettier, nodemon, vite, webpack, jest, ...
  - npm install typescript --save-dev or npm install -D typescript ---> thì nó vào devDependencies.

- Tóm lại : "dependencies" cho lúc chạy — "devDependencies" cho lúc code.

e, Khi nào dùng npx?

- npm(Đi chợ mua đồ về nhà, để dành dùng nhiều lần)
  - Cài đặt package về máy hoặc dự án.
  - Khi muốn lưu lại package để dùng lâu dài.
  - lưu trong node_modules.
- npx(Thuê đồ xài tạm một lần rồi trả lại) là công cụ giúp CHẠY một package ngay lập tức mà không cần phải cài vào máy.

dùng khi

- chỉ muốn chạy nhanh 1 lần, dùng xong thôi.
- Không lưu lại gì cả (xài xong là xong).

- Ví dụ thực tế:

  - Dùng npm:

    npm install create-react-app -g

    create-react-app my-app

    => Bạn phải cài create-react-app vào máy (global) mới xài được.

  - Dùng npx:

    npx create-react-app my-app

    => Bạn không cần cài gì hết, npx tự tải và chạy luôn

  Kết luận:

  - Muốn lưu lâu dài ➔ Dùng npm install.
  - Muốn chạy lẹ, chạy 1 lần ➔ Dùng npx.

f, Tác dụng của package-lock.json

package-lock.json là một file tự động sinh ra khi bạn dùng: npm install

- Nó ghi lại chính xác:

  - Phiên bản (version) của tất cả các package bạn cài,

  - Cả những package phụ (dependencies của dependencies),

  - Và cách npm đã cài những package đó.

- Tác dụng chính của package-lock.json:
  - Giữ đúng phiên bản: Khi bạn cài lại project, nó đảm bảo mọi người đều dùng đúng phiên bản package như lúc đầu.
  - Giúp dự án ổn định: Tránh lỗi do package tự cập nhật (vì npm sẽ đọc theo package-lock.json, không phải lấy version mới nhất).
  - Cài nhanh hơn: Vì npm chỉ cần nhìn package-lock.json và biết luôn phải cài bản nào, thay vì đi tìm trên internet.

Ví dụ:

- Giả sử file package.json ghi: "express": "^4.17.0"(Dấu ^ nghĩa là cho phép cài phiên bản mới hơn (4.17.1, 4.18.0...))

  - Nếu không có package-lock.json, mỗi người npm install có thể cài một phiên bản khác nhau. Dẫn đến:

    - Người A chạy được, người B lỗi tè le(khi thư viện cập nhật lớn).

  - Có package-lock.json

    - ai npm install cũng cài chính xác Express 4.17.1 chẳng hạn, giống hệt nhau.

    - Dự án đồng bộ, tránh lỗi khó chịu.

    Kết luận:

- package.json = Muốn cài gì (danh sách các package bạn cần).
- package-lock.json = Đã cài cái gì (chi tiết phiên bản chính xác).

PHẦN 28–32: Event Loop

1, process.nextTick() vs setTimeout()?

a, process.nextTick()

- process.nextTick() đẩy callback vào microtask queue (cụ thể là nextTick queue), được xử lý ngay sau khi giai đoạn hiện tại của event loop hoàn thành, trước bất kỳ I/O hoặc timer nào.
- Nó có ưu tiên cao hơn các giai đoạn khác như timers (setTimeout, setInterval) hay I/O callbacks.
- Dùng khi bạn muốn xử lý ngay lập tức, nhưng không làm nghẽn hàm đang chạy.
- Lạm dụng process.nextTick() có thể gây starvation (làm tắc nghẽn event loop) vì nó ngăn các giai đoạn khác (như I/O, timers) được xử lý.

b, setTimeout()

- Đẩy callback vào Event Queue, chạy sau khi tất cả nextTick và các tác vụ ưu tiên khác đã xong.
- Chạy chậm hơn một chút vì đợi Event Loop trống--> độ ưu tiên thấp.
- Dùng khi bạn muốn lập lịch một tác vụ với độ trễ (dù là 0ms) hoặc để đảm bảo các tác vụ khác (I/O, rendering) có cơ hội chạy trước

Minh họa siêu dễ:

console.log('Start');

process.nextTick(() => {
console.log('This is process.nextTick');
});

setTimeout(() => {
console.log('This is setTimeout');
}, 0);

console.log('End');

result:

Start

End

This is process.nextTick

This is setTimeout

2, Stack và queue khác gì nhau?

- Stack (Ngăn xếp):
  - Cách hoạt động: Stack hoạt động theo nguyên lý LIFO (Last In, First Out) – phần tử cuối cùng được thêm vào sẽ là phần tử đầu tiên được lấy ra.
  - Phép toán chính:
    - Push: Thêm phần tử vào đầu stack.
    - Pop: Lấy phần tử ra khỏi stack (phần tử vừa thêm vào cuối cùng).
    - Peek/Top: Xem phần tử ở đỉnh mà không lấy nó ra.
  - Ứng dụng của Stack
    - Undo/Redo trong phần mềm: Phần mềm chỉnh sửa văn bản, trình duyệt web, hoặc các công cụ đồ họa sử dụng stack để lưu lại các thao tác người dùng (undo) và các thao tác trở lại (redo). Khi người dùng nhấn "undo", phần tử cuối cùng trong stack sẽ được "pop" ra.
- Queue (Hàng đợi):
  - Cách hoạt động: Queue hoạt động theo nguyên lý FIFO (First In, First Out) – phần tử được thêm vào đầu tiên sẽ là phần tử đầu tiên được lấy ra.
  - Phép toán chính:
    - Enqueue: Thêm phần tử vào cuối hàng đợi.
    - Dequeue: Lấy phần tử ra khỏi đầu hàng đợi.
    - Front: Xem phần tử ở đầu hàng đợi mà không lấy nó ra.
  - Ứng dụng của Queue
    - Xử lý tác vụ (Task Scheduling): Queue rất hữu ích trong việc lên lịch các tác vụ. Các hệ thống quản lý tác vụ (task scheduling systems) sử dụng queue để đảm bảo rằng các tác vụ được xử lý theo đúng thứ tự (FIFO).
    - Xử lý yêu cầu trong web server: Các yêu cầu từ người dùng (requests) trong một hệ thống web server thường được xử lý theo hàng đợi.

3, Dùng setImmediate() khi nào?

- setImmediate() là một phương thức trong Node.js, được sử dụng để đặt một callback vào trong "immediate queue" và thực thi nó sau khi tất cả các I/O events hiện tại đã hoàn thành.
- Khi nào sử dụng setImmediate()?
  - Để tránh blocking event loop:
    - Nếu bạn có một đoạn mã đồng bộ nặng, ví dụ như một vòng lặp hoặc một thao tác tính toán phức tạp, và bạn không muốn làm tắc nghẽn event loop, bạn có thể sử dụng setImmediate() để phân tách các phần của mã, giúp cho event loop có thể tiếp tục xử lý các tác vụ I/O khác.
    - Ví dụ: Trong trường hợp bạn có một công việc lớn cần thực hiện nhưng không muốn nó chặn event loop, bạn có thể chia nó thành nhiều phần và đặt các phần này vào setImmediate().
  - Thực thi sau khi hoàn thành tất cả các I/O events

PHẦN 33–40: fs, path, os
1, fs.readFileSync() và fs.readFile()?

- fs.readFileSync()

  - Là hàm đồng bộ (sync = synchronous).
  - Khi gọi fs.readFileSync(), Node.js sẽ dừng lại, chờ đọc xong file rồi mới làm tiếp các dòng code sau.
  - Code dễ đọc

        Ví dụ

        const fs = require('fs');

        const data = fs.readFileSync('example.txt', 'utf8');

        console.log(data);

        console.log('Done reading file');

        Kết quả chạy:

        <Nội dung file>

         Done reading file

- fs.readFile()

  - Là hàm bất đồng bộ (async = asynchronous).
  - Khi gọi fs.readFile(), Node.js không dừng lại, nó đọc file ngầm, và khi đọc xong sẽ gọi callback (hoặc trả về Promise nếu dùng fs.promises.readFile()).
  - Hiệu suất tốt hơn

  Ví dụ

  const fs = require('fs');

  fs.readFile('example.txt', 'utf8', (err, data) => {

if (err) throw err;

console.log(data);

});

console.log('Done reading file');

Kết quả chạy:

Done reading file

<Nội dung file>

2, path.join() để làm gì?

- path.join()
  - Là hàm của module path trong Node.js.
  - Nó dùng để nối nhiều đoạn path (đường dẫn thư mục/file) lại thành 1 đường dẫn hoàn chỉnh,
    và tự động xử lý dấu / hoặc \ sao cho đúng với hệ điều hành (Linux/macOS dùng /, Windows dùng \).
  - Lợi ích
    - Không cần tự thêm dấu / hay \ giữa các phần.
    - Tránh lỗi sai đường dẫn khi chạy trên các hệ điều hành khác nhau.
    - Dễ ghép đường dẫn một cách sạch sẽ.

Ví dụ:

path.join('a', 'b', 'c.txt') sẽ ghép thành "a/b/c.txt" (hoặc "a\b\c.txt" tùy hệ điều hành) — auto chuẩn.

3, Dùng os.totalmem() để làm gì?

- os.totalmem()

  - Là hàm trong module os của Node.js.
  - Nó trả về tổng dung lượng RAM (bộ nhớ vật lý) của máy tính tính bằng byte.

    Ví dụ:

    const os = require('os');

    const totalMemory = os.totalmem();

    console.log(`Total Memory: ${totalMemory} bytes`);

    Kết quả có thể là: Total Memory: 17179869184 bytes

  Ứng dụng thực tế:

  - Xem tổng RAM để tính toán phân bổ bộ nhớ hợp lý cho app.
  - Kiểm tra máy chủ có đủ RAM trước khi chạy nhiều tiến trình nặng.
  - Làm hệ thống giám sát server: theo dõi RAM tổng và RAM còn trống (os.freemem()).

PHẦN 41–43: Event & HTTP

1, emitter.on() vs once()?

- emit():
  emitter.emit(eventName, [...args]):Có nghĩa là phát (gửi) một sự kiện ra cùng tất cả các tham số cần gửi cho listeners.
- on():
  emitter.on(eventName, listener):
  - Đăng ký 1 listener để nghe sự kiện eventName.
  - Và sau này nếu còn emit('eventName') nữa, nó vẫn được gọi tiếp. ==> Nghe nhiều lần, mỗi lần emit đều phản hồi.
- once()
  mitter.once(eventName, listener)

  - giống như on() nhưng chỉ được gọi 1 lần duy nhất khi sự kiện emit() phát ra, nhưng lần phát emit phát lại thì once() không phản hồi =>> Xong thì tự động hủy luôn, không nghe nữa..

  ví dụ:
  const EventEmitter = require('events');

  const emitter = new EventEmitter();

  emitter.emit('hello'); // Xin chào!

  emitter.emit('hello'); // Xin chào! (lại lần nữa)

  emitter.on('hello', () => {

  console.log('Xin chào!'); ===> in ra 2 lần , emit() phát sự kiện bấy nhiêu thì on phản hồi bấy nhiêu.
  });

  emitter.once('hello', () => {

  console.log('Chào lần đầu tiên!');===> chỉ phản hồi khi sự kiện phát lần đầu , các lần sau thì sẽ không phản hồi.
  });

2, Tạo server đơn giản bằng http.createServer()

- import http from "http";
- http.createServer((req, res) => { ... }): Tạo server, với mỗi request sẽ gọi callback function.
- res.end(): Kết thúc phản hồi và gửi dữ liệu về client.
- server.listen(PORT): Lắng nghe request ở một cổng cụ thể.

3, Cách dùng http.request() giống axios, fetch,...

PHẦN 44: Streams

1, Ưu điểm của stream?

    - Tiết kiệm bộ nhớ: Stream xử lý dữ liệu theo từng phần nhỏ (chunk), không cần load toàn bộ dữ liệu vào RAM.
    - Tăng tốc độ xử lý:  dữ liệu được xử lý ngay khi nhận được, không cần đợi có đủ toàn bộ dữ liệu. như kiểu bạn có thể gửi từng phần đến trình duyệt luôn , tăng tốc độ phản hồi của website.

2, pipe() làm gì?

- pipe() giúp kết nối các luồng(đọc , ghi, xử lý) với nhau mà không cần quản lý thủ công từng phần.
  -------> pipe() tự động lấy dữ liệu từ nguồn → chuyển vào đích, theo từng phần nhỏ (chunk).

  Ví dụ:

// Tạo readable stream để đọc file
const readable = fs.createReadStream('input.txt');

// Tạo writable stream để ghi file
const writable = fs.createWriteStream('output.txt');

// Dùng pipe để chuyển dữ liệu từ readable sang writable
readable.pipe(writable);

- nếu không có pipe ta phải sử lý

readable.on('data', (chunk) => {
writable.write(chunk);
});

readable.on('end', () => {
writable.end();
});

3, Có bao nhiêu loại stream?

- readStream: chỉ đọc
  VD: const readable = fs.createReadStream('input.txt'); --->tạo luồng đọc file input.txt.

  readable.on('data', (chunk) => {

  console.log('Nhận được dữ liệu:', chunk.toString());

  });

- writeStream: chỉ ghi

  const writable = fs.createWriteStream('output.txt');--->tạo luồng ghi vào file output.txt

  writable.write('Hello World!\n');
  writable.end();

- Duplex stream: vừa đọc và ghi độc lập và cùng lúc
  ví dụ dùng trong socket, khi client gửi dữ liệu xuống thì socket đọc dữ liệu và lập tức gửi cho client khác 1 cách realtime.

- Transform stream:vừa đọc vừa ghi và vừa biến đổi dữ liệu giữa các lần đọc ghi
  - Khi nhận dữ liệu, nó xử lý/chuyển đổi rồi gửi dữ liệu đã biến đổi đi để ghi.
  - Ứng dụng:
    - Nhận dữ liệu → Nén lại → Ghi ra file nén
    - Nhận file nén → Giải nén → Trả về dữ liệu gốc
    - mã hóa dữ liệu khi pipe()

PHẦN 45–46: Env & Error Handling

1,Phân biệt development và production.

- Development (dev) là môi trường phát triển
  - Dành cho lập trình viên để code, test, debug.
  - Các công cụ hỗ trợ debug sẽ bật (ví dụ: error stack trace chi tiết, hot reload, console logs đầy đủ).
  - Thường kết nối database test, API test.
- Production (prod) là môi trường chạy thực tế (cho người dùng cuối)
  - Code sẽ được build, nén, tối ưu trước khi đưa lên server.
  - Kết nối với database thật, API thật.
  - Yêu cầu ổn định, bảo mật, nhanh nhất có thể.

Cách chạy
npm run dev → chạy chế độ development.

npm run build → xuất bản ra file tối ưu cho production.

Trong Nodejs kiểm tra môi trường bằng cách process.env.NODE_ENV

2, Dùng try/catch với async/await?

catch nó sẽ bắt tất cả lỗi xảy ra trong try, ngay cả khi promise nó reject kết quả và nó ngắn chặn app bị crash.

- Nếu khi dùng với async/await thì phải để trong try/catch để tránh lỗi bởi vì bản chất 1 await là promise, phải try/catch để bắt lỗi promise đó nếu không muốn app bị crash.

- Có thể bắt riêng lỗi cho từng await bằng cách lồng try/catch cho từng await.

3, Bắt uncaughtException để làm gì?

- uncaughtException là một lỗi (exception) xảy ra mà không được xử lý (caught) ở bất kỳ đâu trong chương trình Node.js. giống như throw new error("dfasfadfasfa") mà không có try/catch thì nó sẽ tự động phát sự kiện uncaughtException.
- có thể bắt lỗi này bằng cách cẩn thận dùng try/catch hoặc nếu bất đồng bộ thì dùng thêm cả .catch nữa cho chắc ăn. hoặc có thể dùng EventEmitter process.on('uncaughtException') để bắt .
- bắt lỗi uncaughtException để cho chương trình không bị crash khi triển khai và đôi khi khai triển trên hệ thống thực tế mà xuất hiện lỗi này thì báo hiệu app đang ở trạng thái không ổn định và tốt nhất process.exit(1); một cách an toàn để fix lại sau.

PHẦN 47–49: HTTP nâng cao
1, GET vs POST khác nhau ở điểm nào?

GET:

- có thể truy cập url bằng browser thông qua phương thức Get
- gửi dữ liệu đến server thông qua query và params
- thuờng dùng để gửi những dữ liệu yêu cầu chỉ đọc.
- Có giới hạn (tùy trình duyệt, thường ~2048 ký tự)
- Ít bảo mật hơn vì dữ liệu nằm trên URL

POST:

- không thể truy cập bằng browser thông qua phương thức Post
- gửi dữ liệu đến server thông qua rawData,Graph,body-form
- thường dùng để yêu cầu server phải ghi
- Không giới hạn đáng kể (tùy server)
- Bảo mật hơn vì dữ liệu không lộ trên URL

2, Cách lấy body trong POST request

- phải có express.json() hoặc express.urlencoded() để đọc body
- bạn có thể dùng destructuring hoặc sử dụng chính object req.body luôn ở trong Expressjs

nếu dùng http thuần: bạn lấy body thông qua stream bằng event req.on('data', chunk => {
body += chunk.toString(); // convert Buffer to string
});

3, Dùng http.ServerResponse ra sao?

- Trong Node.js, khi bạn tạo một server bằng http.createServer, callback (req, res) nhận vào res chính là một đối tượng http.ServerResponse.
  ---> Nó đại diện cho phản hồi (response) mà server sẽ gửi về cho client.
- Các thao tác cơ bản với ServerResponse
  - Thiết lập header: để nói cho browser biết kiểu dữ liệu mà server trả về là gì
    - res.setHeader(name, value),
    - res.writeHead(statusCode, headers). vừa định nghĩa statusCode+Header một cách đồng thời.
  - Gửi dữ liệu:
    - có thể gửi một phần dữ liệu stream về client
      - res.write(chunk)
      - res.end([data]): kết thúc stream và trả về browser những dữ liệu còn thừa.
    - trả về luôn: res.end()
  - Thiết lập mã trạng thái: res.statusCode, res.statusMessage. --> thể hiện trạng thái của kết quả trả về
  - Kết thúc phản hồi: res.end() (bắt buộc để hoàn tất phản hồi). nếu không có thì browser phải đợi mãi mãi vì server chưa kết thúc phản hồi.

CRUK TASKS + CHECK TOKEN +AUTOMATE EXPIRE CHECK
...
const tasks = [
{
id: 1,
deadline: new Date("2024-04-22"),
status: "completed",
},
{
id: 2,
deadline: new Date("2024-04-22"),
status: "completed",
},
{
id: 3,
deadline: new Date("2024-04-22"),
status: "completed",
},
{
id: 4,
deadline: new Date("2024-04-22"),
status: "completed",
},
];
// app.js
import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// / Lấy đường dẫn hiện tại (tương tự **dirname trong CommonJS)
const **filename = fileURLToPath(import.meta.url);
const **dirname = dirname(**filename);
const app = express();
const PORT = 8000;

class HttpError extends Error {
constructor(status, message) {
super(message);
this.status = status;
}
}

const getMaxId = (tasks) => {
return (
tasks.reduce((max, item) => {
return item.id > max ? item.id : max;
}, 0) + 1
);
};
// Middleware để parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware để parse URL-encoded data

//middleware kiem tra token
app.use((req, res, next) => {
const token = req.headers["authorization"];
if (!token) {
return res.status(401).json({ message: "Unauthorized" });
}
next();
});
// get task by criteria or id
app.get("/task", (req, res, next) => {
try {
const { status, id } = req.query;
if (!status && !id) {
return res.status(200).json(tasks);
}
const taskTarget = tasks.filter(
(item) => item.status == status || item.id == id
);
return res.status(200).json(taskTarget); // Trả về danh sách người dùng
} catch (error) {
if ((error.status = 404)) {
return res.status(error.status).json({
message: error.message,
});
}
next(new HttpError(500, error)); // Gọi next() với lỗi để chuyển đến middleware xử lý lỗi
}
});

// delete task by Id
app.delete("/task", (req, res, next) => {
try {
const { id } = req.query;
if (!id) throw new HttpError(404, "id is missing");
const indexTargetItem = tasks.findIndex((item) => item.id == id);
console.log(indexTargetItem);
if (indexTargetItem == -1) {
throw new HttpError(404, "task not found");
}
tasks.splice(indexTargetItem, 1);
console.log(tasks);
return res.status(200).json({
message: "Xóa thành công",
errCode: 0,
}); // Trả về danh sách người dùng
} catch (error) {
if ((error.status = 404)) {
return res.status(error.status).json({
message: error.message,
});
}
next(new HttpError(500, error)); // Gọi next() với lỗi để chuyển đến middleware xử lý lỗi
}
});

// add task by Id
app.post("/task", (req, res, next) => {
try {
const { deadline, status } = req.body;
if (!deadline || !status) throw new HttpError(404, "data is missing");
const maxid = getMaxId(tasks);
console.log(maxid);
tasks.push({
id: maxid,
deadline: new Date(deadline),
status,
});

    return res.status(200).json({
      message: "Thêm thành công",
      errCode: 0,
    }); // Trả về danh sách người dùng

} catch (error) {
if ((error.status = 404)) {
return res.status(error.status).json({
message: error.message,
});
}
next(new HttpError(500, error)); // Gọi next() với lỗi để chuyển đến middleware xử lý lỗi
}
});

// update task by Id
app.put("/task", (req, res, next) => {
try {
const { id, deadline, status } = req.body;
if (!id || !deadline || !status)
throw new HttpError(404, "data is missing");
const indexTargetItem = tasks.findIndex((item) => item.id == id);
if (indexTargetItem == -1) {
throw new HttpError(404, "task not found");
}
tasks[indexTargetItem].deadline = new Date(deadline);
tasks[indexTargetItem].status = status;

    return res.status(200).json({
      message: "update thành công",
      errCode: 0,
    }); // Trả về danh sách người dùng

} catch (error) {
if ((error.status = 404)) {
return res.status(error.status).json({
message: error.message,
});
}
next(new HttpError(500, error)); // Gọi next() với lỗi để chuyển đến middleware xử lý lỗi
}
});

// Route với lỗi 404
app.use((req, res, next) => {
next(new HttpError(404, "Không tìm thấy url này!")); // Gọi next() với lỗi để chuyển đến middleware xử lý lỗi
});
//router lỗi chung
app.use((err, req, res, next) => {
try {
// ghi loi
const errPath = path.join(\_\_dirname, "error.log");
if (!fs.existsSync(errPath)) {
fs.writeFileSync(errPath, ""); // Tạo file rỗng nếu không có
}
fs.createWriteStream(errPath, { flags: "a" }).write(
`${new Date().toISOString()} - ${err.message} - status: ${
        err.status || 500
      }\n`
);
if (process.env.NODE_ENV !== "production") {
console.error(err); // Ghi lỗi vào console nếu không phải môi trường sản xuất
return res.status(err.status || 500).json({
message: err.message,
stack: err.stack, // Gửi thông tin stack trace nếu không phải môi trường sản xuất
});
} else {
return res.status(err.status || 500).json({
message: err.message,
status: err.status || 500,
});
}
} catch (error) {
console.error("Lỗi ghi log:", error); // Ghi lỗi vào console nếu không thể ghi vào file
res.status(500).send("Đã xảy ra lỗi khi xử lý yêu cầu của bạn."); // Gửi thông báo lỗi chung
}
});

setInterval(() => {
const currentDate = new Date();
const itemsExpireIndex = tasks.findIndex(
(item) => item.deadline > currentDate && item.Date != "overdue"
);
if (itemsExpireIndex >= 0) {
tasks[itemsExpireIndex].status = "overdue";
}
}, 1000);

// Khởi động server
app.listen(PORT, () => {
console.log(`Server is running at http://localhost:${PORT}`);
});

...
