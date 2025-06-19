import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { RESTAPI, USER } from "app/constrant/enum";
import { AppError, ErrorValidateZodCustom } from "app/helpers/error";
import customerService from "app/services/customer-service";
import { customerSchema } from "app/validates/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");
    const lastId = url.searchParams.get("lastId");
    const typeCursor = url.searchParams.get("typeCursor") as "after" | "before";
    const query = url.searchParams.get("query") ?? "";
    const orderBy = url.searchParams.get("orderBy") ?? "";
    const skip = url.searchParams.get("skip") ?? 0;
    // pointNext
    if (!typeCursor || (lastId && isNaN(+lastId)) || (limit && isNaN(+limit)))
      throw new AppError("Limit or LastId  required a number", 400);
    // if (!type) throw new AppError("Type is required", 400);
    const response = await customerService.getAllUser({
      limit: limit,
      lastId: lastId,
      typeCursor: typeCursor,
      query,
      orderBy,
      skip: +skip,
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

// export async function action({ request }: ActionFunctionArgs) {
//   try {
//     const contentType = request.headers.get("content-type");
//     if (contentType?.includes("application/json")) {
//       switch (request.method.toUpperCase()) {
//         case RESTAPI.POST: {
//           const body = await request.json();
//           const isVadilate = customerSchema.safeParse(body);
//           if (!isVadilate.success) {
//             return ErrorValidateZodCustom(isVadilate);
//           }

//           const response = await customerService.createOrUpdateUser(body);
//           const { ST, ...restObject } = response;
//           return json(restObject, { status: ST });
//         }
//         case RESTAPI.DELETE: {
//           const url = new URL(request.url);
//           const id = url.searchParams.get("id");
//         }
//         default: {
//           return new Response("Method Not Allowed", { status: 405 });
//         }
//       }
//     }
//     return new Response("Content Type must be application/json", {
//       status: 405,
//     });
//     // Kiểm tra phương thức HTTP
//   } catch (error) {
//     if (error instanceof AppError) {
//       return json({ EC: 1, EM: error.message }, { status: error.status });
//     }
//     return json({ EC: 1, EM: "Server Error" }, { status: 500 });
//   }
// }
