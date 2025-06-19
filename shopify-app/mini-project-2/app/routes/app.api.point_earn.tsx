import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { ALL_CODES, EXCHANGE, RESTAPI } from "../constrant/enum";
import { AppError, ErrorValidateZodCustom } from "../helpers/error";
import { Iresponse } from "../interfaces/api";
import pointService from "../services/point-service";
import { MoneyToPointSchema, PointToVoucherSchema } from "../validates/point";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const lastId = url.searchParams.get("lastId");
    const typeCursor = url.searchParams.get("typeCursor");
    if (!typeCursor || (typeCursor != "after" && typeCursor != "before"))
      throw new AppError("TypeCursor is required", 400);
    if (!type) throw new AppError("Type is required", 400);
    const response = await pointService.getAllPoint(type, typeCursor, lastId);
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
          const body = await request.json();
          const url = new URL(request.url);
          const id = url.searchParams.get("id");
          if (!body.type || !id) {
            return json(
              { EC: 1, EM: "Type or Id is missing" },
              { status: 400 },
            );
          }
          if (isNaN(+id)) throw new AppError("Id must be a number", 400);
          let response = {} as Iresponse<any>;

          let data;
          if (body.type == ALL_CODES.EARN) {
            const { moneyAmount, condition } = body;
            data = {
              moneyAmount: +moneyAmount,
              condition: +condition,
            };
          } else if (body.type == ALL_CODES.SPEND) {
            const { moneyAmount, pointNumber } = body;
            data = {
              moneyAmount: +moneyAmount,
              pointNumber: +pointNumber,
            };
          } else {
            response = {
              ST: 500,
              EM: "SERVICE IS NOT RESPONSE",
              EC: 1,
            };
          }
          const schema =
            body.type == ALL_CODES.EARN
              ? MoneyToPointSchema
              : PointToVoucherSchema;
          const isValidateData = schema.safeParse(data);

          if (!isValidateData.success) {
            return ErrorValidateZodCustom(isValidateData);
          }
          response = await pointService.updatePoint(
            +id,
            isValidateData.data,
            body.type,
          );
          const { ST, ...restObject } = response;
          return json(restObject, { status: ST });
        }
        case RESTAPI.POST: {
          const body = await request.json();
          // const type = formData.get(EXCHANGE.TYPE) as string;
          if (!body.type) {
            return json({ EC: 1, EM: "Type is required" }, { status: 400 });
          }
          let response = {} as Iresponse<any>;

          let data;
          if (body.type == ALL_CODES.EARN) {
            const { moneyAmount, condition } = body;

            data = {
              moneyAmount: +moneyAmount,
              condition: +condition,
            };
          } else if (body.type == ALL_CODES.SPEND) {
            const { moneyAmount, pointNumber } = body;
            data = {
              moneyAmount: +moneyAmount,
              pointNumber: +pointNumber,
            };
          } else {
            response = {
              ST: 500,
              EM: "SERVICE IS NOT RESPONSE",
              EC: 1,
            };
          }
          const schema =
            body.type == ALL_CODES.EARN
              ? MoneyToPointSchema
              : PointToVoucherSchema;
          const isValidateData = schema.safeParse(data);

          if (!isValidateData.success) {
            return ErrorValidateZodCustom(isValidateData);
          }
          response = await pointService.createPoint(
            isValidateData.data,
            body.type,
          );
          const { ST, ...restObject } = response;
          return json(restObject, { status: ST });
        }
        case RESTAPI.DELETE: {
          const url = new URL(request.url);
          const id = url.searchParams.get("id");
          const type = url.searchParams.get("type");
          if (!id || !type) throw new AppError("Id or Type is required", 400);
          if (isNaN(+id)) throw new AppError("Id must be a number", 400);
          const response = await pointService.deletePoint(+id, type);
          const { ST, ...restObject } = response;
          return json(restObject, { status: ST });
        }
        default: {
          return new Response("Method Not Allowed", { status: 405 });
        }
      }
    }
    return new Response("Content Type must be application/json", {
      status: 415,
    });
    // Kiểm tra phương thức HTTP
  } catch (error) {
    if (error instanceof AppError) {
      return json({ EC: 1, EM: error.message }, { status: error.status });
    }
    return json({ EC: 1, EM: "Server Error" }, { status: 500 });
  }
}
