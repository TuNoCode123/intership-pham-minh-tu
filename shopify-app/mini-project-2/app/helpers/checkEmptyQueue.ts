// import { customerAllQueue } from "app/queues/jobs/customerQueue";

import { getRedis, initRedisNoSub } from "app/redis.server";
import { getSocket } from "./socket";
import { AppError } from "./error";

const checkIfQueueEmpty = async (queueName: any, shopId: any) => {
  const counts = await queueName.getJobCounts();
  console.log(counts);

  if (counts.waiting === 0) {
    console.log("✅ Queue đã xử lý xong toàn bộ job");
  }
};
export default checkIfQueueEmpty;
