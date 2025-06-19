import { REASON } from "app/constrant/record";
import db from "app/db.server";
import { AppError, handleError } from "app/helpers/error";
import { getGreaterRank, getRank } from "app/helpers/getRank";
import { fetchPaginatedData } from "app/helpers/pagination";
import { CustomerWithRank } from "app/routes/app.customer";

import { CursorType } from "app/validates/point";
import { customerType } from "app/validates/user";

class CustomerService {
  async getAllUser({
    limit,
    typeCursor,
    lastId,
    query,
    shopId,
    orderBy,
    skip,
    group,
  }: {
    typeCursor: "after" | "before";
    limit: any;
    lastId: any;
    query?: string;
    orderBy?: string | null;
    skip?: number;
    group?: string;
    shopId?: string;
  }): Promise<{
    EC: number;
    EM: any;
    ST: number;
    DT?: {
      data: CustomerWithRank[];
      cursor: CursorType;
      listRank: any[];
    };
  }> {
    try {
      const validLimit = limit && limit > 0 ? limit : (process.env.LIMIT ?? 5);
      const groupClause = {} as any;
      if (group && group != "none") {
        // const keyArr = group.split("-");
        // const key = keyArr.length > 0 ? keyArr[0] : "";
        // const value = keyArr.length > 0 ? keyArr[1] : "";

        groupClause["rankingId"] = {
          equals: +group,
        };
      }
      // db.customers.findMany({
      //   where: {
      //     OR: [
      //       { firstName: { contains: query } },
      //       { lastName: { contains: query } },
      //       { email: { contains: query } },
      //     ],
      //    shopId
      //   },
      //   include: {
      //     rank: {
      //       where: {
      //         shopId: shopId,
      //       },
      //     },
      //   },
      // });
      const listUser = fetchPaginatedData(
        db.customers,
        +validLimit,
        lastId ? lastId : 0,
        typeCursor,
        {
          include: {
            total_point: {
              select: {
                total_points: true,
              },
            },
            rank: {
              where: {
                shopId,
              },
              select: {
                tierName: true,
                id: true,
              },
            },
          },
        },
        {
          // shopId,
          OR: [
            { firstName: { contains: query } },
            { lastName: { contains: query } },
            { email: { contains: query } },
          ],
          AND: {
            shopId,
          },
          ...groupClause,
        },
        orderBy
          ? orderBy == "newest"
            ? { created_at: "desc" }
            : orderBy == "odest"
              ? { created_at: "asc" }
              : {
                  total_point: { total_points: orderBy ? orderBy : "asc" },
                }
          : undefined,
        skip,
      );
      const listRank = db.customerRanking.findMany({
        where: {
          shopId,
        },
      });
      const [userResult, rankResult] = await Promise.all([listUser, listRank]);
      const data = userResult.data as any[];

      return {
        EC: 0,
        EM: "GET LIST USER SUCCESSFULLY",
        DT: {
          ...userResult,
          data: data.map((item) => {
            return {
              ...item,
              total_point: item.total_point?.total_points ?? 0,
            };
          }),
          listRank: rankResult,
        },
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async createOrUpdateUser(user: customerType, shopId: string) {
    try {
      console.log("user1111", user);
      const { total_point: total_point_args, ...restObject } = user;
      const isExistedUser = await db.customers.findUnique({
        where: {
          customerId: user.customerId,
        },
        include: {
          total_point: {
            select: {
              total_points: true,
            },
          },
        },
      });
      if (isExistedUser) {
        const currentUpdateTime = new Date(
          isExistedUser.updated_at ?? "",
        ).getTime();
        const upcomingUpdateTime = new Date(user.updated_at ?? "").getTime();
        if (currentUpdateTime >= upcomingUpdateTime) {
          return {
            EC: 0,
            EM: "USER UPDATE EXISTED SUCCESSFULLY",
            ST: 200,
            DT: {
              shopId: shopId,
            },
          };
        }
      }
      // if (!isExistedUser) throw new AppError("user not found", 404);
      //   const inputData=isExistedUser
      const result = await db.$transaction(async (prismaTx) => {
        const newUser = await prismaTx.customers.upsert({
          where: { customerId: user.customerId },
          create: {
            ...restObject,
            shopId,
          },
          update: {
            ...restObject,
          },
        });
        const total_points =
          total_point_args ?? isExistedUser?.total_point?.total_points ?? 0;
        await prismaTx.points.upsert({
          where: {
            customerId: newUser.id,
          },
          create: {
            total_points,
            customerId: newUser.id,
          },
          update: {
            total_points,
          },
        });
        return { user: { ...newUser, total_point: { total_points } } };
      });
      const { user: UserDb } = result;
      return {
        EC: 0,
        EM: isExistedUser
          ? "UPDATE USER SUCCESSFULLY"
          : "CREATE USER SUCCESSFULLY",
        DT: UserDb,
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async deleteUser(id: number) {
    try {
      await db.customers.delete({
        where: {
          id,
        },
      });
      return {
        EC: 0,
        EM: "DELETE USER SUCCESSFULLY",
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async getPoint({
    customerId,
    amount,
    productList,
    shopId,
  }: {
    customerId: string;
    amount: number;
    productList: {
      productId: string;
      orderNumber: number;
    }[];
    shopId: string;
  }) {
    try {
      console.log("enter func11", shopId);
      const isExistedCustomer = db.customers.findUnique({
        where: {
          customerId,
        },
        select: {
          id: true,
          total_spent: true,
          rank: {
            where: {
              shopId,
            },
            select: {
              id: true,
              pointRate: true,
            },
          },
        },
      });
      if (!isExistedCustomer) throw new AppError("customer is not found", 404);

      const getListRank = db.customerRanking.findMany({
        where: {
          shopId,
        },
      });
      const [customerResult, listRankResult] = await Promise.all([
        isExistedCustomer,
        getListRank,
      ]);
      if (!customerResult) throw new Error("customer is not found");
      const increAmount = amount * (customerResult?.rank?.pointRate ?? 0.00005);

      await db.$transaction(async (prismaTx) => {
        const resPoint = prismaTx.points.upsert({
          where: {
            customerId: customerResult.id,
          },
          create: {
            total_points: increAmount,
            customerId: customerResult.id,
          },
          update: {
            total_points: {
              increment: increAmount,
            },
          },
        });
        const inputData = {
          type: "L1",
          reason: REASON["ORDER"],
          customerId: customerResult.id,
          amount: +increAmount,
          shopId,
        };
        const resPointLog = prismaTx.point_Logs.create({
          data: inputData,
        });

        const getNewRank = getRank(
          customerResult.total_spent,
          listRankResult.map((item) => ({
            id: item.id,
            min_spent: item.min_spent,
          })),
          customerResult.rank?.id ?? 1,
        );

        let funcAnc = [];
        if (getNewRank) {
          const updateRank = prismaTx.customers.update({
            where: {
              id: customerResult.id,
            },
            data: {
              rankingId: getNewRank.id,
              total_spent: {
                increment: +amount,
              },
            },
          });
          funcAnc.push(updateRank);
        } else {
          const updateTotalSpen = prismaTx.customers.update({
            where: {
              id: customerResult.id,
            },
            data: {
              total_spent: {
                increment: +amount,
              },
            },
          });
          funcAnc.push(updateTotalSpen);
        }

        await Promise.all([
          ...productList.map((item) => {
            return prismaTx.orderNumber.upsert({
              where: {
                customerId_productId: {
                  customerId: customerResult.id,
                  productId: item.productId,
                },
              },
              create: {
                customerId: customerResult.id,
                productId: item.productId,
                purchaseNumber: +item.orderNumber,
                shopId,
              },
              update: {
                purchaseNumber: {
                  increment: +item.orderNumber,
                },
              },
            });
          }),
          resPoint,
          resPointLog,
          ...funcAnc,
        ]);
      });
      return {
        EC: 0,
        EM: "EARN POINT SUCCESSFULLY",
        ST: 200,
      };
    } catch (error) {
      console.log("ERROR11111", error);
      return handleError(error);
    }
  }
  async getTotalPoint(customerId: string, shopId: string) {
    try {
      const pointUser = db.customers.findUnique({
        where: {
          customerId,
          shopId,
        },
        select: {
          total_spent: true,
          rankingId: true,
          total_point: {
            select: {
              total_points: true,
            },
          },
          rank: {
            where: {
              shopId,
            },
            select: {
              tierName: true,
              pointRate: true,
              min_spent: true,
            },
          },
        },
      });
      const getListRank = db.customerRanking.findMany({
        where: {
          shopId,
        },
      });

      const [pointResult, rankResult] = await Promise.all([
        pointUser,
        getListRank,
      ]);
      if (!pointResult) throw new AppError("customer is not found", 404);
      if (!rankResult || rankResult.length < 0)
        throw new AppError("rank is not found", 404);
      console.log("pointResult", pointResult);
      const getGreater = getGreaterRank(
        pointResult?.rank?.min_spent ?? 0,
        rankResult,
        pointResult?.rankingId ?? 1,
      );
      return {
        EC: 0,
        EM: "GET TOTAL POINT SUCCESSFULLY",
        ST: 200,
        DT: {
          totalPoints: pointResult?.total_point?.total_points ?? 0,
          rank: {
            tierName: pointResult?.rank?.tierName ?? "Vô hạng",
            id: pointResult?.rankingId ?? 1,
            pointRate: pointResult?.rank?.pointRate ?? 0.00005,
          },
          totalSpent: pointResult?.total_spent ?? 0,
          greaterRank: getGreater,
        },
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async canComment(customerId: string, productId: string) {
    try {
      const isExistedUser = await db.customers.findUnique({
        where: {
          customerId,
        },
      });
      if (!isExistedUser) throw new AppError("user not found", 404);
      const getReviewNumber = await db.orderNumber.findUnique({
        where: {
          customerId_productId: {
            customerId: isExistedUser.id,
            productId,
          },
        },
      });
      const isTrue = getReviewNumber && getReviewNumber?.purchaseNumber > 0;
      return {
        EC: 0,
        EM: "GET SUCCESS",
        DT: {
          isCanComment: isTrue ? true : false,
          commentNumber: getReviewNumber?.purchaseNumber ?? 0,
        },
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async updatePointForUser({
    customerId,
    amount,
    reason,
    shopId,
  }: {
    customerId: number;
    amount: number;
    reason: string;
    shopId: string;
  }) {
    try {
      const isExistedUser = await db.customers.findUnique({
        where: {
          id: customerId,
          shopId,
        },
      });
      if (!isExistedUser) throw new AppError("user not found", 404);

      const pointUpdate = db.points.upsert({
        where: {
          customerId: customerId,
        },
        update: {
          total_points: amount,
        },
        create: {
          total_points: amount,
          customerId,
        },
      });
      const pointLog = db.point_Logs.create({
        data: {
          type: "L8",
          reason,
          customerId,
          amount,
          shopId,
        },
      });
      await Promise.all([pointUpdate, pointLog]);
      return {
        EC: 0,
        EM: "UPDATE POINT SUCCESSFULLY",
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async updateRankForUser(customerId: number, rankId: number, shopId: string) {
    try {
      const isExistedUser = db.customers.findUnique({
        where: {
          id: customerId,
          shopId,
        },
      });

      const isExistedRank = db.customerRanking.findUnique({
        where: {
          id: rankId,
          shopId: shopId,
        },
      });
      const [userResult, rankResult] = await Promise.all([
        isExistedUser,
        isExistedRank,
      ]);
      if (!userResult || !rankResult)
        throw new AppError("user or rank not found", 404);
      await db.customers.update({
        where: {
          id: customerId,
        },
        data: {
          rankingId: rankId,
        },
      });
      return {
        EC: 0,
        EM: "UPDATE RANK SUCCESSFULLY",
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async softDeleteCustomer(customerId: string, shopId: string) {
    try {
      await db.customers.update({
        where: {
          customerId: customerId,
          shopId,
        },
        data: {
          isDelete: true,
        },
      });
      return {
        EC: 0,
        EM: "SOFT DELETE CUSTOMER SUCCESSFULLY",
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
}
export default new CustomerService();
