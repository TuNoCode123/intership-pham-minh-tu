import { AppError, handleError } from "app/helpers/error";
import { initRedis, getRedis, initRedisNoSub } from "app/redis.server";

class RedisService {
  setKey = async ({
    key,
    value,
    time,
  }: {
    key: string;
    value: string;
    time: number;
  }) => {
    try {
      await initRedis();
      const { redis } = getRedis();
      if (!redis) {
        console.log("noRedis");
        throw new AppError("redis not ready", 500);
      }
      const res = await redis.set(key, value, "EX", time, "NX");
      if (!res) throw new AppError("key duplicated", 400);

      return {
        EC: 0,
        EM: "SET KEY SUCCESSFULLY",
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  };
  getKey = async (key: string) => {
    try {
      await initRedis();
      const { redis } = getRedis();
      if (!redis) {
        throw new AppError("redis not ready", 500);
      }
      const res = await redis.get(key);
      if (!res) throw new AppError("key or value not found", 404);
      return {
        EC: 0,
        EM: "GET KEY SUCCESSFULLY",
        ST: 200,
        DT: res,
      };
    } catch (error) {
      return handleError(error);
    }
  };
  setKeyNoTime = async ({ key, value }: { key: string; value: string }) => {
    try {
      await initRedisNoSub();
      const { redisNoSub } = getRedis();
      if (!redisNoSub) throw new AppError("redis not ready", 500);
      const res = await redisNoSub?.set(key, value);
      if (!res) throw new AppError("key duplicated", 400);
      return {
        EC: 0,
        EM: "SET KEY SUCCESSFULLY",
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  };
  deleteKey = async (key: string) => {
    try {
      const { redis } = getRedis();
      if (!redis) {
        throw new AppError("redis not ready", 500);
      }
      const res = await redis.del(key);
      return {
        EC: 0,
        EM: "DELETE KEY SUCCESSFULLY",
        ST: 200,
        DT: res,
      };
    } catch (error) {
      return handleError(error);
    }
  };
}
export default new RedisService();
