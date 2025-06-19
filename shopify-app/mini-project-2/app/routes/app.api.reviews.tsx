import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { ClientActionFunctionArgs, json } from "@remix-run/react";
import { RESTAPI } from "app/constrant/enum";
import { AppError, ErrorValidateZodCustom } from "app/helpers/error";
import cloudinaryService from "app/services/cloudinary-service";
import reviewService from "app/services/review-service";
import { createReviewSchema } from "app/validates/reviews";
function withCloudinary(handler: Function) {
  return async ({ request, params, context }: ActionFunctionArgs) => {
    //  product_id: string;
    // customer_id: string;
    // rating: number;
    // content: string;
    // approved?: boolean | undefined;
    const formData = await request.formData();
    const productId = formData.get("product_id") as string;
    console.log("productId", productId);
    const customerId = formData.get("customer_id") as string;
    const rating = formData.get("rating") as string;
    const content = formData.get("content") as string;
    const shopId = formData.get("shopId") as string;
    if (!productId || !customerId || !rating || !content || !shopId) {
      return json({ error: "missing input" }, { status: 400 });
    }

    const files = formData.getAll("images") as File[];
    let result;
    if (files && files.length > 0) {
      result = await Promise.all(
        files.map((file: File) => {
          return cloudinaryService.uploadImages(file);
        }),
      );
    }

    // const result = await Promise.all(
    //   files.map((file: File) => {
    //     return cloudinaryService.uploadImages(file);
    //   }),
    // );

    const enhancedContext = {
      ...context,
      urls:
        result &&
        result
          .filter((url) => !!url?.DT?.url)
          .map((u) => ({
            url: u?.DT?.url,
            publicId: u?.DT?.public_id,
          })),
      product_id: productId,
      customer_id: customerId,
      rating: rating,
      content: content,
      shopId: shopId,
    };

    return handler({ request, params, context: enhancedContext });
  };
}
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");
    const lastId = url.searchParams.get("lastId");
    const typeCursor =
      (url.searchParams.get("typeCursor") as "after" | "before") ?? "after";
    const query = url.searchParams.get("query") ?? "";
    const group = url.searchParams.get("group") ?? "";
    const orderBy = url.searchParams.get("orderBy");
    const skip = url.searchParams.get("skip") ?? 0;
    if ((lastId && isNaN(+lastId)) || (limit && isNaN(+limit)))
      throw new AppError("Limit or LastId  required a number", 400);
    // if (!type) throw new AppError("Type is required", 400);
    const response = await reviewService.getAllReviews({
      limit: limit,
      lastId: lastId,
      typeCursor,
      query,
      group,
      skip: +skip,
      orderBy,
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

export const action = withCloudinary(
  async ({ request, context }: ActionFunctionArgs) => {
    const { urls, product_id, customer_id, rating, content, shopId } =
      context as any;
    try {
      console.log("context", context.urls);
      // const contentType = request.headers.get("content-type");
      // if (contentType?.includes("application/json")) {
      switch (request.method.toUpperCase()) {
        case RESTAPI.PUT: {
        }
        case RESTAPI.POST: {
          const isVadilate = createReviewSchema.safeParse({
            product_id: product_id,
            customer_id: customer_id,
            rating: +rating,
            content: content,
            shopId: shopId,
          });
          if (!isVadilate.success) {
            return ErrorValidateZodCustom(isVadilate);
          }

          const response = await reviewService.createReview({
            ...isVadilate.data,
            urls,
            shopId,
          });
          const { ST, ...restObject } = response;
          if (restObject.EC == 1) {
            throw new AppError(restObject.EM, ST);
          }
          return json(restObject, { status: ST });
        }
        case RESTAPI.DELETE: {
        }
        default: {
          return new Response("Method Not Allowed", { status: 405 });
        }
      }
    } catch (error) {
      console.log("errrrrorr");
      Promise.allSettled(
        urls.map((item: any) =>
          cloudinaryService.deleteImageFromCloudinary(item.url),
        ),
      ).then((data) => {
        data.forEach((result, index) => {
          if (result.status === "fulfilled") {
            const { EM } = result.value as any;
            console.log(`✅ testttt ${EM}`);
          } else {
            console.error(
              `❌ Failed to delete: ${urls[index].url}`,
              result.reason,
            );
          }
        });
      });

      console.log("ERROR", error);
      if (error instanceof AppError) {
        return json({ EC: 1, EM: error.message }, { status: error.status });
      }
      return json({ EC: 1, EM: "Server Error" }, { status: 500 });
    }
  },
);
