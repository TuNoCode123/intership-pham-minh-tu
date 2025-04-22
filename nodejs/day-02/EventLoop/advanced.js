import { performance } from "perf_hooks";

const numIterations = parseInt(process.argv[2]) || 1; // Lấy số vòng lặp từ tham số dòng lệnh, mặc định là 1
const executionLog = [];

function recordExecution(type, id) {
  executionLog.push(`${type} ${id}`);
}

function runIteration(iteration) {
  console.log(`\n--- Bắt đầu vòng lặp thứ ${iteration + 1} ---`);
  const startTime = performance.now();

  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      recordExecution("setTimeout", i);
    }, 0);

    setImmediate(() => {
      recordExecution("setImmediate", i);
    });

    process.nextTick(() => {
      recordExecution("process.nextTick", i);
    });
  }

  // Chờ một khoảng thời gian ngắn để các tác vụ bất đồng bộ có cơ hội thực thi
  // Đây không phải là cách chính xác để đảm bảo tất cả đã hoàn thành,
  // nhưng đủ cho mục đích minh họa đơn giản.
  setTimeout(() => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log("\n--- Kết thúc vòng lặp ---");
    console.log("Thứ tự thực thi:", executionLog.join(", "));
    console.log(
      `Tổng thời gian thực thi:${iteration + 1} vòng lặp là`,
      duration.toFixed(3),
      "ms"
    );
    executionLog.length = 0; // Reset log cho vòng lặp tiếp theo

    if (iteration < numIterations - 1) {
      runIteration(iteration + 1);
    }
  }, 200); // Điều chỉnh thời gian chờ nếu cần
}

console.log(`Thực hiện ${numIterations} vòng lặp.`);
runIteration(0);
