import { json, LoaderFunctionArgs } from "@remix-run/node";
import { AppError } from "app/helpers/error";
import customerService from "app/services/customer-service";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  try {
    const { id } = params;
    const url = new URL(request.url);
    const shopId = url.searchParams.get("shopId");
    // pointNext
    if (!id || !shopId) throw new AppError("Id or shopId is missing", 400);
    const response = await customerService.getTotalPoint(
      `gid://shopify/Customer/${id}`,
      shopId,
    );
    const { ST, ...restObject } = response;
    return json(restObject, { status: ST });
  } catch (error) {
    if (error instanceof AppError) {
      return json({ EC: 1, EM: error.message }, { status: error.status });
    }
    return json({ EC: 1, EM: "Server Error" }, { status: 500 });
  }
};
