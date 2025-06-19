import { CUSTOMER_QUEUE } from "app/constrant/queue";

import { Queue } from "bullmq";
import { settingRepeatJobs } from "../settings/rrule";

// const customerQueueScheduler = new QueueScheduler("Paint");
export const customerQueue = new Queue("customerQueue", {
  connection: {
    host: "127.0.0.1",
    port: 6380,
  },
});

export const customerAllQueue = new Queue("customerAllQueue", {
  connection: {
    host: "127.0.0.1",
    port: 6380,
  },
});

export const cronQueue = new Queue(CUSTOMER_QUEUE.cronCustomerUpdate, {
  connection: {
    host: "127.0.0.1",
    port: 6380,
  },
  settings: settingRepeatJobs,
});
export const syncCustomerQueue = new Queue(CUSTOMER_QUEUE.customerOveralSync, {
  connection: {
    host: "127.0.0.1",
    port: 6380,
  },
});
// const job1 = await customerQueue.add(
//   "bird",
//   { color: "bird" },
//   {
//     repeat: {
//       every: 10000,
//       limit: 100,
//     },
//     jobId: "colibri",
//     removeOnComplete: true,
//   },
// );
