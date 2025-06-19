import { fetchPaginatedData } from "app/helpers/pagination";
import { ALL_CODES } from "../constrant/enum";
import db from "../db.server";
import { AppError, handleError } from "../helpers/error";
import redisService from "./redis-service";
import { CustomerRanking } from "app/interfaces/point";

class PointService {
  async createPoint(data: any, type: string, sId: string) {
    try {
      const getType = await db.allCodes.findMany();
      const findType = getType.find((v) => v.key == type);
      if (!findType) throw new AppError("not match type", 404);
      const isCreateMoneyToPoint = findType.value === ALL_CODES.EARN;
      if (isCreateMoneyToPoint) {
        await db.customerRanking.create({
          data: {
            ...data,
            shopId: sId,
          },
        });
      } else {
        const isExisted = await db.pointToVoucher.findFirst({
          where: {
            OR: [
              { pointNumber: data.pointNumber },
              { moneyAmount: data.moneyAmount },
            ],
            AND: {
              shopId: sId,
            },
          },
        });

        if (isExisted) throw new AppError("duplicated data", 400);
        await db.pointToVoucher.create({
          data: {
            ...data,
            shopId: sId,
          },
        });
      }

      return {
        EC: 0,
        ST: 200,
        EM: isCreateMoneyToPoint
          ? "CREATE POINT EARN PRINCIPLE SUCCESSFULLY"
          : "CREATE POINT TO VOUCHER PRINCIPLE SUCCESSFULLY",
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          EC: 1,
          EM: error.message,
          ST: 400,
        };
      }
      return {
        EC: 1,
        EM: "Server Error",
        ST: 500,
      };
    }
  }
  async getAllPoint<T>(
    type: string,
    typeCursor: "after" | "before",
    shopId: string,
    lastId?: any,
    limit?: any,
  ): Promise<{
    EC: number;
    EM: any;
    ST: number;
    DT?: T;
  }> {
    try {
      const getType = await db.allCodes.findMany();
      const findType = getType.find((v) => v.value == type);
      if (!findType) throw new AppError("not match type", 404);
      let data;
      const realLimit = limit ? limit : (process.env.LIMIT ?? 3);
      console.log("realLimit", realLimit);
      if (findType.value === ALL_CODES.EARN) {
        data = await fetchPaginatedData(
          db.customerRanking,
          +realLimit,
          lastId ? lastId : 0,
          typeCursor,
          undefined,
          {
            shopId,
          },
        );
        // data = await fetchPaginatedData(
        //   db.moneyToPoint,
        //   +realLimit,
        //   lastId ? lastId : 0,
        //   typeCursor,
        // );
      } else if (findType.value === ALL_CODES.SPEND) {
        data = await fetchPaginatedData(
          db.pointToVoucher,
          +realLimit,
          lastId ? lastId : 0,
          typeCursor,
          undefined,
          {
            shopId,
          },
        );
      }
      return {
        EC: 0,
        ST: 200,
        DT: data as T,
        EM: "GET ALL POINT SUCCESSFULLY",
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          EC: 1,
          EM: error.message,
          ST: 400,
        };
      }
      return {
        EC: 1,
        EM: "Server Error",
        ST: 500,
      };
    }
  }
  async updatePoint(id: number, data: any, type: string) {
    try {
      const getType = await db.allCodes.findMany();
      const findType = getType.find((v) => v.key == type);
      if (!findType) throw new AppError("not match type", 404);
      if (findType.value == ALL_CODES.EARN) {
        await db.customerRanking.update({
          where: {
            id,
          },
          data,
        });
      } else {
        await db.pointToVoucher.update({
          where: {
            id,
          },
          data,
        });
      }

      return {
        EC: 0,
        ST: 200,
        EM: "UPDATE POINT SUCCESSFULLY",
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async deletePoint(id: number, type: string) {
    try {
      const getType = await db.allCodes.findMany();
      const findType = getType.find((v) => v.key == type);
      if (!findType) throw new AppError("not match type", 404);
      if (findType.value == ALL_CODES.EARN) {
        await db.customerRanking.delete({
          where: {
            id,
          },
        });
      } else {
        await db.pointToVoucher.delete({
          where: {
            id,
          },
        });
      }
      return {
        EC: 0,
        ST: 200,
        EM: "DELETE POINT SUCCESSFULLY",
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async getAllPointSpend(ahopId: string) {
    try {
      const key = "pointToVoucher";
      const cacheData = (await redisService.getKey(key)) as any;
      // if (cacheData.EC === 0 && cacheData.DT) {
      //   return {
      //     EC: 0,
      //     ST: 200,
      //     EM: "GET ALL CACHED POINT EARN SUCCESSFULLY",
      //     DT: JSON.parse(cacheData?.DT!),
      //   };
      // }
      const data = await db.pointToVoucher.findMany({
        where: {
          shopId: ahopId,
        },
      });
      await redisService.setKey({
        key,
        value: JSON.stringify(data),
        time: 60 * 60,
      });
      return {
        EC: 0,
        ST: 200,
        EM: "GET ALL POINT EARN SUCCESSFULLY",
        DT: data,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async createRaking(data: CustomerRanking, shopId: string) {
    try {
      const res = await db.customerRanking.upsert({
        where: {
          shopId_tierName: {
            shopId,
            tierName: data.tierName,
          },
        },
        create: {
          ...data,
          shopId,
        },
        update: {
          ...data,
        },
      });
      return {
        EC: 0,
        ST: 200,
        EM: "CREATE RANKING SUCCESSFULLY",
        DT: res,
      };
    } catch (error) {
      return handleError(error);
    }
  }
}
export default new PointService();
