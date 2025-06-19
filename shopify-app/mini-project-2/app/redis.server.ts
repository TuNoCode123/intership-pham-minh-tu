import Redis from "ioredis";
import redeemService from "./services/redeem-service";
import { getSocket } from "./helpers/socket";

const STATE_REDIS = {
  CONNECT: "connect",
  END: "end",
  RECONNECT: "reconnect",
  ERROR: "error",
};

const logsStateCurrentRedis = (redis: Redis) => {
  if (!redis) {
    console.log("paramater redis not existed");
    return;
  }
  redis.on(STATE_REDIS.CONNECT, () => {
    console.log("Connecting redis ");
  });
  redis.on(STATE_REDIS.RECONNECT, () => {
    console.log("Reconnecting redis ");
  });
  redis.on(STATE_REDIS.END, () => {
    console.log("Disconnected redis ");
  });
  redis.on(STATE_REDIS.ERROR, (error: any) => {
    console.error("Lỗi kết nối Redis:", error);
  });
};

const redisCore: { redis?: Redis; redisNoSub?: Redis } = {};

// const ioCore: { io?: Socket } = {};
const initRedisNoSub = async () => {
  const redis = new Redis({
    host: "127.0.0.1",
    port: 6380,
  });
  redisCore.redisNoSub = redis;
  logsStateCurrentRedis(redis);
};
const initRedis = async () => {
  const redis = new Redis({
    host: "127.0.0.1",
    port: 6380,
  });
  const socket = getSocket();

  socket.connect();

  socket.on("connect", () => {
    socket.emit("adminOnline");
    console.log("✅ Socket connected:", socket.id);
  });

  redisCore.redis = redis;
  const sub = redisCore.redis.duplicate();
  if (!sub) {
    console.error("Không thể tạo kết nối sao chép Redis.");
    return;
  }
  // register event on redis
  await sub.config("SET", "notify-keyspace-events", "Ex");
  sub.subscribe("__keyevent@0__:expired", (err) => {
    if (err) {
      console.error("Lỗi khi đăng ký sự kiện:", err);
    } else {
      console.log("Đã đăng ký sự kiện hết hạn.");
    }
  });

  // Xử lý sự kiện hết hạn
  sub.on("message", async (channel, key) => {
    try {
      if (channel === "__keyevent@0__:expired") {
        if (key.startsWith("redeem")) {
          const keyArr = key.split("-");
          if (keyArr.length > 1) {
            const id = keyArr[1];
            const customerId = keyArr[2];
            const res = await redeemService.changeStatusCoupon(+id);
            socket.emit("couponExpired", {
              codeId: id,
              customerId,
            });
            console.log("respone------", res);
          }
        }
        // if (key.startsWith("coupon")) {
        // }
        // if (key.startsWith("itemOrder")) {
        // }
        // console.log("coupon expired", key);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      console.log("error at redis", error);
    }
  });
  logsStateCurrentRedis(redis);
};
const getRedis = () => redisCore;
process.on("SIGINT", () => {
  const { redis } = redisCore;
  redis?.quit(() => {
    console.log("Redis client disconnected through app termination");
    process.exit(0);
  });
});
export { initRedis, getRedis, initRedisNoSub };
