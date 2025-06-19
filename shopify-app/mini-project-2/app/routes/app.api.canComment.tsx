import { json, LoaderFunctionArgs } from "@remix-run/node";
import { AppError } from "app/helpers/error";
import customerService from "app/services/customer-service";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const customerId = url.searchParams.get("customerId");
    const productId = url.searchParams.get("productId");
    if (!customerId || !productId)
      throw new AppError("customerId or productId is required", 400);
    const response = await customerService.canComment(
      `gid://shopify/Customer/${customerId}`,
      `gid://shopify/Product/${productId}`,
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
