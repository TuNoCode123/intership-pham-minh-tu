import { Queue, QueueEvents, Worker } from "bullmq";
import { Redis } from "ioredis";

// Khởi tạo kết nối Upstash Redis
const redisConnection = new Redis(
  "rediss://default:AYjWAAIjcDFhMThhMzU1ODUzMmQ0NzUzYWU5MzVlNmZmNTdhYTkxMHAxMA@free-elf-35030.upstash.io:6379",
);
// Tạo Queue, Worker, QueueEvents
export const myQueue = new Queue("Paint", { connection: redisConnection });
export const myWorker = new Worker(
  "Paint",
  async (job) => {
    console.log("Đang xử lý job:", job.id, job.data);
    return { result: "Hoàn thành công việc Paint" };
  },
  { connection: redisConnection },
);

const queueEvents = new QueueEvents("Paint", { connection: redisConnection });

queueEvents.on("completed", ({ jobId }) => {
  console.log(`Job ${jobId} hoàn thành`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.error(`Job ${jobId} lỗi: ${failedReason}`);
});

// // Thêm job để kiểm tra
// async function addJob() {
//   await myQueue.add("paintJob", { color: "blue", area: "wall" });
//   console.log("Đã thêm job vào hàng đợi Paint");
// }
// addJob();
