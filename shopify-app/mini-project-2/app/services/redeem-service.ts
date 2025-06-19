import { AppError, handleError } from "app/helpers/error";
import { CodeRedeemed, Redeemed } from "app/validates/redeem";
import { v4 as uuidv4 } from "uuid";
import db from "../db.server";
import { REASON } from "app/constrant/record";
import { fetchPaginatedData } from "app/helpers/pagination";
import { IredeemData } from "app/interfaces/redeem";
import { CursorType } from "app/validates/point";
import redisService from "./redis-service";
import { API } from "app/constrant/api";
const validId = (id?: any) => (id ? id : -1);
class RedeemService {
  async createRedeem(
    redeem: CodeRedeemed & {
      typeKey: string;
      shopId: string;
    },
  ) {
    try {
      const {
        customerId,
        exchangeId,
        id_code,
        id_redeem,
        point_used,
        amount,
        shopId,
      } = redeem;

      const isExistedType = db.allCodes.findMany();

      const isExsitedCustomer = db.customers.findUnique({
        where: {
          customerId: `gid://shopify/Customer/${customerId}`,
          shopId: shopId,
        },
        select: {
          total_point: true,
          id: true,
          customerId: true,
        },
      });

      const isExsitedExchange = db.pointToVoucher.findUnique({
        where: {
          id: exchangeId,
          shopId: shopId,
        },
      });

      const [typeResult, customerResult, exchangeResult] = await Promise.all([
        isExistedType,
        isExsitedCustomer,
        isExsitedExchange,
      ]);
      if (typeResult.length == 0 || !exchangeResult || !customerResult)
        throw new AppError(
          typeResult
            ? "have not records"
            : !exchangeResult
              ? "Voucher not existed"
              : !exchangeResult
                ? "Customer not existed"
                : "codeId and redeemId not existed",
          404,
        );
      if (point_used && amount) {
        const ratioInput = amount / point_used;
        const ratioAvaiable =
          exchangeResult.moneyAmount / exchangeResult.pointNumber;
        if (ratioInput !== ratioAvaiable) {
          throw new AppError(
            "amount and point_used must be in the same ratio as moneyAmount and pointNumber",
            400,
          );
        }
      }

      const codeId = validId(id_code);
      const redeemId = validId(id_redeem);
      let point_used_value: number = 0;

      const isCreate = codeId == -1 && redeemId == -1;
      const typeCreate = isCreate ? "L2" : "L3";

      const typeInput = typeResult.find((item) => item.key == redeem.typeKey);

      if (!typeInput || typeInput.key != typeCreate)
        throw new AppError("type wrong", 400);
      if (isCreate) {
        const currentTotalPoint = customerResult.total_point?.total_points;

        if (
          !currentTotalPoint ||
          currentTotalPoint < exchangeResult.pointNumber
        ) {
          throw new AppError("your total point is not enough to exchange", 406);
        }
      } else {
        if (codeId == -1 || redeemId == -1)
          throw new AppError("codeId and RedeemId must needed for updating");
        const isExsitedCode = db.code.findUnique({
          where: {
            id: codeId,
          },
        });

        const isExsitedRedeem = db.redeemed.findUnique({
          where: {
            id: redeemId,
            codeId: codeId,
            customerId: customerResult.id,
          },
        });

        const [codeResult, redeemResult] = await Promise.all([
          isExsitedCode,
          isExsitedRedeem,
        ]);
        if (!codeResult || !redeemResult)
          throw new AppError(
            !codeResult
              ? "codeId not existed"
              : !redeemResult
                ? "redeemId not existed"
                : "codeId and redeemId not existed",
            404,
          );
        point_used_value = redeemResult.point_used ?? 0;
      }

      const result = await db.$transaction(async (prismaTx) => {
        const createCode = await prismaTx.code.upsert({
          where: {
            id: codeId,
          },
          update: {
            customerId: customerResult.id,
            isUsed: redeem.isUsed,
          },
          create: {
            code: uuidv4(),
            customerId: customerResult.id,
          },
        });
        const data = {
          codeId: createCode.id,
          amount: amount ?? 0,
          customerId: customerResult.id,
          exchangeId: redeem.exchangeId,
          point_used: point_used ?? 0,
          shopId: shopId,
        };
        const redeems = await prismaTx.redeemed.upsert({
          where: {
            id: redeemId,
          },
          update: {
            ...data,
          },
          create: {
            ...data,
          },
        });
        if (isCreate) {
          await prismaTx.points.update({
            where: {
              customerId: customerResult.id,
            },
            data: {
              total_points: {
                decrement: point_used ?? 0,
              },
            },
          });
        } else {
          const valueAmount = point_used_value - exchangeResult.pointNumber;
          // const pointNumber = redeem.amount - amount_value;
          await prismaTx.points.update({
            where: {
              customerId: customerResult.id,
            },
            data: {
              total_points: {
                increment: valueAmount,
              },
            },
          });

          // const point_used=isExsitedRedeem.
        }
        const inputData = {
          type: typeInput.key,
          reason: REASON["VOUCHER"],
          customerId: customerResult.id,
          amount: exchangeResult.moneyAmount,
          shopId: shopId,
        };
        //logging
        const logPoint = prismaTx.point_Logs.create({
          data: inputData,
        });
        const endDate = new Date(redeems.created_at);
        endDate.setUTCDate(endDate.getUTCDate() + 2);

        const endAt = endDate.toISOString();
        const responseCode = fetch(API.fetchSaveDiscount, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: createCode.code,
            startAt: new Date(redeems.created_at).toISOString(),
            endAt: endAt,
            amount: redeems.amount,
          }),
        });
        const [response, ...rest] = await Promise.all([
          responseCode,
          logPoint,
          redisService.setKey({
            key: `redeem-${createCode.id}-${customerResult.customerId}`,
            value: JSON.stringify(createCode.code),
            time: 20,
          }),
        ]);
        if (!response.ok)
          throw new AppError("request create code on admin failed", 500);
        const data1 = await response.json();
        const { EC, EM } = data1;
        if (EC == 1) throw new AppError(EM, 400);
        return { ...redeems, code: createCode.code };
      });
      // await

      // await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        EC: 0,
        DT: result,
        EM: isCreate
          ? "CREATE CODE SUCCESSFULLY"
          : "UPDATE REDEEM SUCCESSFULLY",
        ST: 200,
      };
    } catch (error) {
      console.log("ERROR1111", error);
      return handleError(error);
    }
  }
  async getAllRedeemLogs({
    lastId,
    limit,
    typeCursor,
    query,
    orderBy,
    shopId,
    skip,
    group,
  }: {
    lastId: any;
    limit: any;
    typeCursor: "after" | "before";
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
      data: IredeemData[];
      cursor: CursorType;
    };
  }> {
    try {
      // db.redeemed.findMany({
      //   include: {
      //     code: {
      //       select: {
      //         code: true,
      //         isUsed: true,
      //       },
      //     },
      //     customer: {
      //       select: {
      //         firstName: true,
      //         lastName: true,
      //         email: true,
      //       },
      //     },
      //     exchange: {
      //       select: {
      //         moneyAmount: true,
      //         pointNumber: true,
      //       },
      //     },
      //   },
      //   orderBy: [{ amount: "asc" }],
      //   where: {
      //     code: {
      //       isUsed: {
      //         equals: group,
      //       },
      //     },
      //   },
      // });
      const isActive = group === "true";
      const groupClause = {} as any;
      if (group) {
        groupClause.code = {
          isUsed: {
            equals: isActive,
          },
        };
      }
      const id = lastId ? lastId : 0;
      const numbeRecords = limit ? limit : (process.env.LIMIT ?? 5);
      const newQuery = query ? query : "";
      const data = await fetchPaginatedData(
        db.redeemed,
        numbeRecords,
        id,
        typeCursor,
        {
          include: {
            code: {
              select: {
                code: true,
                isUsed: true,
              },
            },
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            exchange: {
              select: {
                moneyAmount: true,
                pointNumber: true,
              },
            },
          },
        },
        {
          shopId,
          customer: {
            OR: [
              { firstName: { contains: newQuery } },
              { lastName: { contains: newQuery } },
              { email: { contains: newQuery } },
            ],
          },
          ...groupClause,
        },
        orderBy
          ? orderBy == "newest"
            ? { created_at: "desc" }
            : orderBy == "odest"
              ? { created_at: "asc" }
              : { amount: orderBy }
          : undefined,
        skip,
      );
      return {
        EC: 0,
        EM: "Get Redeem Logs Successfully",
        DT: data,
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async getRedeemByCustomerId({
    customerId,
    lastId,
    limit,
    typeCursor,
    orderBy,
    skip,
    group,
  }: {
    customerId: string;
    lastId?: any;
    limit?: any;
    typeCursor: "after" | "before";
    orderBy?: string | null;
    skip?: number;
    group?: string | null;
  }) {
    try {
      // db.redeemed.findMany({
      //   select: {
      //     id: true,
      //     amount: true,
      //     point_used: true,
      //     created_at: true,
      //     codeId: true,
      //     code: {
      //       select: {
      //         code: true,
      //         isUsed: true,
      //         status: true,
      //       },
      //     },
      //   },
      //   where: {
      //     code: {
      //       status,
      //     },
      //   },
      // });
      const clause = {} as any;
      if (group) {
        if (group == "used") {
          clause.code = {
            is: {
              isUsed: true,
              status: false,
            },
          };
        } else if (group == "notUsed") {
          clause.code = {
            is: {
              isUsed: false,
              status: false,
            },
          };
        } else if (group == "expired") {
          clause.code = {
            is: {
              status: true,
            },
          };
        }
      }
      console.log("clause1111", clause);
      const isExistedCustomer = await db.customers.findUnique({
        where: {
          customerId: `gid://shopify/Customer/${customerId}`,
        },
      });
      if (!isExistedCustomer) throw new AppError("Customer not existed", 404);
      const id = lastId && lastId != "undefined" ? lastId : 0;
      const numbeRecords = limit ? limit : (process.env.LIMIT ?? 5);

      const data = fetchPaginatedData(
        db.redeemed,
        numbeRecords,
        id,
        typeCursor,
        {
          select: {
            id: true,
            amount: true,
            point_used: true,
            created_at: true,
            codeId: true,
            code: {
              select: {
                code: true,
                isUsed: true,
                status: true,
              },
            },
          },
        },
        {
          customerId: isExistedCustomer.id,
          ...clause,
        },
        orderBy && orderBy != "none"
          ? orderBy == "desc"
            ? { created_at: "desc" }
            : { created_at: "asc" }
          : undefined,
        skip,
      );

      const res = db.redeemed.aggregate({
        where: {
          customerId: isExistedCustomer.id,
        },
        _count: {
          _all: true,
        },
        _sum: {
          point_used: true,
          amount: true,
        },
      });
      const [dataResut, inforResult] = await Promise.all([data, res]);
      return {
        EC: 0,
        EM: "Get Redeem By Customer Id Successfully",
        DT: { ...dataResut, infor: inforResult },
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async changeStatusCoupon(id: number) {
    try {
      await db.code.update({
        where: {
          id,
        },
        data: {
          isUsed: false,
          status: true,
        },
      });
      return {
        EC: 0,
        EM: "Change Status Coupon Successfully",
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async changeStatusCouponToUsed(code: string) {
    try {
      const res = await db.code.update({
        where: {
          code: code,
        },
        data: {
          isUsed: true,
          status: false,
        },
      });
      redisService.deleteKey(`redeem-${res.id}`);
      return {
        EC: 0,
        EM: "Change Status Coupon Successfully",
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
}
export default new RedeemService();
