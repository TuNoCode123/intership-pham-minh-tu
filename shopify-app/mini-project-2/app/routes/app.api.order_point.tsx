import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { RESTAPI, USER } from "app/constrant/enum";
import { AppError, ErrorValidateZodCustom } from "app/helpers/error";
import customerService from "app/services/customer-service";
import { customerSchema, orderPointSchema } from "app/validates/user";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      switch (request.method.toUpperCase()) {
        case RESTAPI.POST: {
          const body = await request.json();
          const isVadilate = orderPointSchema.safeParse(body);
          if (!isVadilate.success) {
            return ErrorValidateZodCustom(isVadilate);
          }
          const response = await customerService.getPoint(body);
          const { ST, ...restObject } = response;
          return json(restObject, { status: ST });
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
