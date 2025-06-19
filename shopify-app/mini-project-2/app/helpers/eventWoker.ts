import { Worker } from "bullmq";
import { getSocket } from "./socket";
import { getRedis, initRedisNoSub } from "app/redis.server";
import { AppError } from "./error";
import { CUSTOMER_QUEUE } from "app/constrant/queue";
import redisService from "app/services/redis-service";
import { REDIS } from "app/constrant/redis";

function attachWorkerEvents(worker: Worker) {
  worker.on("ready", () => {
    console.log(`[${worker.name}] Worker ready`);
  });

  worker.on("active", (job) => {
    console.log(`[${worker.name}] Job ${job.id} is now active`);
  });

  worker.on("completed", async (job, rs) => {
    if (job.name == CUSTOMER_QUEUE.customerSync) {
      await initRedisNoSub();
      const { redisNoSub } = getRedis();
      if (!redisNoSub) {
        throw new AppError("redis no sub not ready", 500);
      }

      const {
        DT: { shopId },
      } = rs;
      const getKeys = await redisNoSub.get(`lastId-${shopId}`);
      console.log("getKeys", getKeys);
      if (getKeys == job.id) {
        console.log("queue finished");
        const socket = getSocket();
        socket.connect();
        socket.emit("queueDone", `admin-${job.data.shopId}`);
      }
    } else if (job.name == CUSTOMER_QUEUE.notHaveCustomer) {
      const socket = getSocket();
      socket.connect();
      socket.emit("queueDone", `admin-${job.data.shopId}`);
    }

    console.log(`[${worker.name}] Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[${worker.name}] Job ${job?.id} failed with error:`, err);
  });

  worker.on("error", (err) => {
    console.error(`[${worker.name}] Worker error:`, err);
  });

  worker.on("stalled", (jobId) => {
    console.warn(`[${worker.name}] Job ${jobId} stalled`);
  });
}
export default attachWorkerEvents;
