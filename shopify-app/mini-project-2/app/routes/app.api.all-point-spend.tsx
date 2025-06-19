import { json, LoaderFunctionArgs } from "@remix-run/node";
import { AppError } from "app/helpers/error";
import pointService from "app/services/point-service";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const shopId = url.searchParams.get("shopId");
    // pointNext
    if (!shopId) throw new AppError("shopId is missing", 400);
    const response = await pointService.getAllPointSpend(shopId);
    const { ST, ...restObject } = response;
    return json(restObject, { status: ST });
  } catch (error) {
    if (error instanceof AppError) {
      return json({ EC: 1, EM: error.message }, { status: error.status });
    }
    return json({ EC: 1, EM: "Server Error" }, { status: 500 });
  }
};
