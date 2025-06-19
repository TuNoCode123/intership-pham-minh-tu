// import customerService from "../../services/customer-service.js";
import { CUSTOMER_QUEUE } from "app/constrant/queue";
import { AppError } from "app/helpers/error";
import attachWorkerEvents from "app/helpers/eventWoker";
import { IcustomerUpdateCreate } from "app/interfaces/queue";
import customerService from "app/services/customer-service";
import { Worker } from "bullmq";
import db from "../../db.server";
import { cronQueue, syncCustomerQueue } from "../jobs/customerQueue";
import { settingRepeatJobs } from "../settings/rrule";
import fetchBulkOperationCustomers from "app/helpers/bulkOperationCustomer";

interface ShopifyCustomer {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  numberOfOrders: string;
  email: string;
  state: "ENABLED" | "DISABLED";
  amountSpent: {
    amount: string;
    currencyCode: string;
  };
  shopId: string;
  EM?: string;
}

const myFirstWorker = new Worker<IcustomerUpdateCreate>(
  "customerQueue",
  async (job) => {
    let response;
    if (job.name === CUSTOMER_QUEUE.customerCreateOrUpdate) {
      const { getShopId, ...restObj } = job.data;
      response = await customerService.createOrUpdateUser(
        {
          ...restObj,
        },
        getShopId,
      );
    } else if (job.name === CUSTOMER_QUEUE.customerDelete) {
      const { customerId, getShopId } = job.data;

      response = await customerService.softDeleteCustomer(
        customerId,
        getShopId,
      );
    }
    console.log("response", response);
    const { ST, EC, ...restObject } = response as any;
    if (EC == 0) {
      return {
        EC,
        ...restObject,
      };
    } else {
      throw new AppError(restObject.EM, ST);
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6380,
    },
  },
);

const syncCustomerWorker = new Worker<ShopifyCustomer>(
  "customerAllQueue",
  async (job) => {
    if (job.name === CUSTOMER_QUEUE.customerSync) {
      const {
        shopId,
        state,
        numberOfOrders,
        amountSpent,
        id,
        createdAt,
        updatedAt,
        ...restObj
      } = job.data;
      const response = (await customerService.createOrUpdateUser(
        {
          ...restObj,
          created_at: createdAt,
          updated_at: updatedAt,
          customerId: id,
        },
        shopId,
      )) as any;
      const { ST, EC, ...restObject } = response as any;
      if (EC == 0) {
        return {
          EC,
          ...restObject,
        };
      } else {
        throw new AppError(restObject.EM, ST);
      }
    } else if (job.name === CUSTOMER_QUEUE.notHaveCustomer) {
      return true;
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6380,
    },
    concurrency: 5,
  },
);

await cronQueue.upsertJobScheduler(
  "init_sync_customers_cron",
  {
    pattern: "RRULE:FREQ=MINUTELY;BYSECOND=30,50;DTSTART=20250618T181600",
  },
  {
    data: { jobType: "sync_cron_job" },
  },
);

const cronWorker = new Worker(
  CUSTOMER_QUEUE.cronCustomerUpdate,
  async () => {
    const shops = await db.shop.findMany({
      where: {
        status: "installed",
      },
    });

    if (shops.length > 0)
      await Promise.all(
        shops.map((s) => {
          const { id, accessToken, status, domain } = s;
          if (status == "installed") {
            return syncCustomerQueue.add(
              `shop-${id}-sync-customers`,
              {
                shopId: id,
                accessToken,
                domain,
              },
              {
                jobId: `shop-${id}`,
                removeOnComplete: true,
                removeOnFail: false,
                attempts: 3,
                backoff: {
                  type: "exponential",
                  delay: 1000,
                },
              },
            );
          }
        }),
      );
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6380,
    },
    settings: settingRepeatJobs,
  },
);

const syncOverallCustomerWorker = new Worker<{
  shopId: string;
  accessToken: string;
  domain: string;
}>(
  CUSTOMER_QUEUE.customerOveralSync,
  async (job) => {
    const { shopId, accessToken, domain } = job.data;
    const fetchCustomer = await fetchBulkOperationCustomers({
      shopId,
      accessToken,
      domain,
    });
    return fetchCustomer;
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6380,
    },
  },
);

attachWorkerEvents(syncOverallCustomerWorker);
attachWorkerEvents(cronWorker);
attachWorkerEvents(myFirstWorker);
attachWorkerEvents(syncCustomerWorker);
