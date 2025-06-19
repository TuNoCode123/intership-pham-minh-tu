import { REDIS } from "app/constrant/redis";
import redisService from "app/services/redis-service";

export const getLargestUpdateTime = (arrCustomers: any, shopId: any) => {
  let longer_Update = 0;

  for (const line of arrCustomers) {
    const customer = JSON.parse(line);
    const customerTimeUpdate = new Date(customer.updatedAt).getTime();
    if (!longer_Update || longer_Update < customerTimeUpdate) {
      longer_Update = customerTimeUpdate;
    }
  }
  let asyncFunc = [];
  console.log("longer_Update", longer_Update);
  if (longer_Update || !isNaN(new Date(longer_Update).getTime())) {
    const isoLargesTime = new Date(longer_Update + 1).toISOString();
    const setTime = redisService.setKeyNoTime({
      key: `${REDIS.LAST_SYNC}-${shopId}`,
      value: isoLargesTime,
    });
    asyncFunc.push(setTime);
  }
  return asyncFunc;
};
