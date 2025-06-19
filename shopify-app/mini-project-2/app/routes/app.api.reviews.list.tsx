import { json, LoaderFunctionArgs } from "@remix-run/node";
import { AppError } from "app/helpers/error";
import reviewService from "app/services/review-service";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit") ?? 10;
    const lastId = url.searchParams.get("lastId");
    const typeCursor = url.searchParams.get("typeCursor") as "after" | "before";
    const productId = url.searchParams.get("productId");
    const orderBy = url.searchParams.get("orderBy");
    const group = url.searchParams.get("group");

    // orderBy
    const skip = url.searchParams.get("skip");

    if (!productId) throw new AppError("productId is required", 400);
    if (lastId != "undefined")
      if ((lastId && isNaN(+lastId)) || (limit && isNaN(+limit)))
        throw new AppError("Limit or LastId  required a number", 400);
    // if (!type) throw new AppError("Type is required", 400);
    const response = await reviewService.getReviewsByProductId({
      productId: `gid://shopify/Product/${productId}`,
      limit: limit,
      lastId: lastId,
      typeCursor,
      orderBy,
      skip: skip ? +skip : 0,
      group,
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
