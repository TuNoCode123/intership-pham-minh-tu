import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { RESTAPI } from "app/constrant/enum";
import { AppError } from "app/helpers/error";
import reviewService from "app/services/review-service";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { id } = params;
    if (!id || isNaN(+id)) throw new AppError("Id is required Or wrong", 400);

    const response = await reviewService.getDetailReview(+id);
    const { ST, ...restObject } = response;
    return json(restObject, { status: ST });
  } catch (error) {
    if (error instanceof AppError) {
      return json({ EC: 1, EM: error.message }, { status: error.status });
    }
    return json({ EC: 1, EM: "Server Error" }, { status: 500 });
  }
};
export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      switch (request.method.toUpperCase()) {
        case RESTAPI.PUT: {
        }
        case RESTAPI.POST: {
        }
        case RESTAPI.DELETE: {
          const { id } = params;
          if (!id) throw new AppError("Id is required", 400);
          const response = await reviewService.deleteReview(+id);
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
};
