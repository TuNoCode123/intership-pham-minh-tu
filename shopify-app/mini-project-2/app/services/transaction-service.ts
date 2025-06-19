import { AppError, handleError } from "app/helpers/error";
import db from "../db.server";
import { REASON } from "app/constrant/record";
import { fetchPaginatedData } from "app/helpers/pagination";
import { CursorType, PointLog } from "app/validates/point";
import { ITransaction } from "app/interfaces/point";

class TransactionService {
  async createOrUpdateTransaction(data: any) {
    try {
      const { type, resonType, customerId, id, amount, shopId } = data;
      const getType = await db.allCodes.findMany();
      const findType = getType.find((v) => v.key == type);
      if (!findType) throw new AppError("not match type", 404);
      const getReasonType = Object.keys(REASON).find(
        (item) => item == resonType,
      );
      if (!getReasonType) throw new AppError("not match reason type", 404);
      const isCheckCustomer = await db.customers.findUnique({
        where: {
          id: customerId,
        },
      });
      if (!isCheckCustomer) throw new AppError("customer is not found", 404);
      const inputData = {
        type,
        reason: REASON[resonType],
        customerId,
        amount: +amount,
      };
      const point_log_id = id ? id : -1;
      const res = await db.point_Logs.upsert({
        where: {
          id: point_log_id,
          // shop: shopId,
        },
        create: {
          ...inputData,
          shop: shopId,
        },
        update: {
          ...inputData,
        },
      });
      return {
        EC: 0,
        EM: id ? "Update Logs Successfully" : "Create Logs Successfully",
        DT: res,
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }

  async getTransactions({
    lastId,
    limit,
    typeCursor,
    query,
    group,
    shopId,
    orderBy,
    skip,
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
      data: ITransaction[];
      cursor: CursorType;
    };
  }> {
    try {
      const cursor = lastId ? lastId : 0;
      const numbeRecords = limit ? limit : (process.env.LIMIT ?? 5);
      const groupClause = {} as any;
      if (group) {
        groupClause.type = {
          equals: group,
        };
      }
      // db.point_Logs.findMany({
      //   where: {
      //     customer: {
      //       OR: [
      //         { firstName: { contains: query } },
      //         { lastName: { contains: query } },
      //         { email: { contains: query } },
      //       ],
      //     },
      //     type: {
      //       equals: "L1",
      //     },
      //   },
      //   orderBy: [{ amount: "asc" }],
      // });
      const newQuery = query ?? "";
      const data = await fetchPaginatedData(
        db.point_Logs,
        numbeRecords,
        cursor,
        typeCursor,
        {
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            allCode: {
              select: {
                value: true,
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
          // type: {
          //   equals: group ?? "",
          // },
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
        EM: "Get Transactions Successfully",
        DT: data,
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
}
export default new TransactionService();
//
