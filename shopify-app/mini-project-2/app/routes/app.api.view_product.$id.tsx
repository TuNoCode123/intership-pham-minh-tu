import { json, LoaderFunctionArgs } from "@remix-run/node";
import reviewService from "app/services/review-service";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (!id || isNaN(+id))
    return json({
      EC: 1,
      EM: "missing input",
    });

  const response = await reviewService.getOverviewProduct(+id);
  const { ST, ...restObject } = response;
  return json(restObject, { status: ST });
};
