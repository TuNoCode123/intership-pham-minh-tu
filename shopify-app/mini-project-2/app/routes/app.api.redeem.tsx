import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { RESTAPI, USER } from "app/constrant/enum";
import { AppError, ErrorValidateZodCustom } from "app/helpers/error";
import customerService from "app/services/customer-service";
import redeemService from "app/services/redeem-service";
import transactionService from "app/services/transaction-service";
import { PointLogSchema } from "app/validates/point";
import { CombinedCodeRedeemedSchema } from "app/validates/redeem";
import { customerSchema } from "app/validates/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");
    const lastId = url.searchParams.get("lastId");
    const typeCursor = url.searchParams.get("typeCursor") as "after" | "before";
    const query = url.searchParams.get("query") ?? "";

    if ((lastId && isNaN(+lastId)) || (limit && isNaN(+limit)))
      throw new AppError("Limit or LastId  required a number", 400);
    // if (!type) throw new AppError("Type is required", 400);
    const response = await redeemService.getAllRedeemLogs({
      limit: limit,
      lastId: lastId,
      typeCursor,
      query,
    });
    const { ST, ...restObject } = response;
    return json(restObject, { status: ST });
  } catch (error) {
    if (error instanceof AppError) {
      return json({ EC: 1, EM: error.message }, { status: error.status });
    }
    return json({ EC: 1, EM: "Server Error" }, { status: 500 });
  }
};

export async function action({ request }: ActionFunctionArgs) {
  try {
    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      switch (request.method.toUpperCase()) {
        case RESTAPI.PUT: {
        }
        case RESTAPI.POST: {
          const body = await request.json();
          const isVadilate = CombinedCodeRedeemedSchema.safeParse(body);
          if (!isVadilate.success) {
            return ErrorValidateZodCustom(isVadilate);
          }

          const response = await redeemService.createRedeem(body);
          const { ST, ...restObject } = response;
          return json(restObject, { status: ST });
        }
        case RESTAPI.DELETE: {
        }
        default: {
          return new Response("Method Not Allowed", { status: 405 });
        }
      }
    }
    return new Response("Content Type must be application/json", {
      status: 405,
    });
    // Kiểm tra phương thức HTTP
  } catch (error) {
    if (error instanceof AppError) {
      return json({ EC: 1, EM: error.message }, { status: error.status });
    }
    return json({ EC: 1, EM: "Server Error" }, { status: 500 });
  }
}
