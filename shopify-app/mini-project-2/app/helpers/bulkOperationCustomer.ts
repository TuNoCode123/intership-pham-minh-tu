import { REDIS } from "app/constrant/redis";
import redisService from "app/services/redis-service";
import { AppError } from "./error";

const fetchBulkOperationCustomers = async ({
  domain,
  accessToken,
  shopId,
}: {
  domain: string;
  accessToken: string;
  shopId: string;
}) => {
  try {
    const url = `https://${domain}/admin/api/2025-04/graphql.json`;
    const header = {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    };
    const getLargestUpdateData = (await redisService.getKey(
      `${REDIS.LAST_SYNC}-${shopId}`,
    )) as any;
    let time = "";
    if (getLargestUpdateData.EC == 0 && getLargestUpdateData?.DT) {
      time = `(query: "updated_at:>'${getLargestUpdateData?.DT}'")`;
    }
    const body = `
    mutation {
  bulkOperationRunQuery(
    query: """
    {
      customers ${time} {
        edges {
          node {
            id
            firstName
            lastName
            email
            createdAt
            updatedAt
          }
        }
      }
    }
    """
  ) {
    bulkOperation {
      id
      status
    }
    userErrors {
      field
      message
    }
  }
}
`;
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify({ query: body }),
    });
    if (!response.ok) {
      throw new AppError("error at bulk operation", response.status);
    }
    // const data = await response.json();
    return "ok";
  } catch (error: any) {
    console.error(error);
    throw new AppError(error.message, 500);
  }
};
export default fetchBulkOperationCustomers;
