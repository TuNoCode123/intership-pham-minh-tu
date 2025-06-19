import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "app/shopify.server";

export const action: ActionFunction = async ({ request }) => {
  // const { session } = await authenticate.admin(request);

  // const { accessToken } = session;
  const adminToken = process.env.ADMIN_ACCESS_TOKEN ?? "";
  const shop = process.env.ADMIN_DOMAIN ?? "";
  const body = await request.json();
  const { code, startAt, endAt, amount } = body;
  if (!code || !startAt || !endAt || !amount) {
    return json({ EC: 1, EM: "Missing Input" }, 400);
  }
  console.log("input111", code, startAt, endAt, amount);
  const mutation = `
  mutation CreateDiscountCode($basicCodeDiscount: DiscountCodeBasicInput!) {
  discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
    codeDiscountNode {
      id
      codeDiscount {
        ... on DiscountCodeBasic {
          title
          startsAt
          endsAt
          customerSelection {
            ... on DiscountCustomerAll {
              allCustomers
            }
            ... on DiscountCustomers {
              customers {
                id
              }
            }
          }
          customerGets {
            value {
              ... on DiscountAmount {
                amount {
                  amount
                }
              }
            }
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
  `;
  // "2025-06-11T00:00:00Z"
  // "2025-07-11T00:00:00Z"
  const variables = {
    basicCodeDiscount: {
      title: "DISCOUNT",
      code: code,
      startsAt: startAt,
      endsAt: endAt,
      customerSelection: {
        all: true,
      },
      customerGets: {
        items: {
          all: true,
        },
        value: {
          discountAmount: {
            amount: +amount,
            appliesOnEachItem: false,
          },
        },
      },
      appliesOncePerCustomer: true,
      usageLimit: 1,
    },
  };

  try {
    const response = await fetch(
      `https://shopoftu2.myshopify.com/admin/api/2024-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": "shpua_2506dc429618dc71970737f0c825a825",
          // "X-Shopify-Access-Token": adminToken!,
        },
        body: JSON.stringify({
          query: mutation,
          variables,
        }),
      },
    );
    if (response.ok) {
      console.log("Token còn dùng được");
    } else {
      console.log("Token KHÔNG còn dùng được", response.status);
    }
    const result = await response.json();
    console.log("GraphQL Result:", JSON.stringify(result, null, 2));
    if (result.data?.discountCodeBasicCreate?.userErrors?.length > 0) {
      return json({
        EC: 1,
        EM: result.data.discountCodeBasicCreate.userErrors,
      });
    }

    return json({
      EC: 0,
      DT: result.data.discountCodeBasicCreate.codeDiscountNode.codeDiscount,
    });
  } catch (err) {
    console.error("Error1111", err);
    return json({ EC: 1, message: "Server error" }, 500);
  }
};
