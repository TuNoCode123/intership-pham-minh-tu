import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "app/shopify.server";
import invariant from "tiny-invariant";

export enum SortKey {
  TITLE_ASC = "TITLE_ASC",
  TITLE_DESC = "TITLE_DESC",
  TITLE = "TITLE",
}

function getSortParams(value: string) {
  switch (value) {
    case SortKey.TITLE_ASC:
      return { sortKey: "TITLE", reverse: false };
    case SortKey.TITLE_DESC:
      return { sortKey: "TITLE", reverse: true };
    default:
      return { sortKey: "TITLE", reverse: false };
  }
}

export const action = async ({ request }: LoaderFunctionArgs) => {
  const {
    admin: { graphql },
    session,
  } = await authenticate.admin(request);
  invariant(session.shop, "Shop not found");

  const url = new URL(request.url);
  const limit = url.searchParams.get("first") || "2";
  const after = url.searchParams.get("after") || null;
  const search = url.searchParams.get("search") || null;
  const sortKey = url.searchParams.get("sortKey") || null;
  const before = url.searchParams.get("before") || null;
  const last = url.searchParams.get("last") || "2";
  const getSort = getSortParams(sortKey || SortKey.TITLE_ASC);
  let effectiveAfter = after ?? before;
  if (sortKey && search) {
    effectiveAfter = null;
  }
  // const effectiveAfter = getSort.reverse ? null : after;
  if (after && getSort.reverse) {
    console.log("Warning: Resetting 'after' to null because reverse is true");
  }
  const typeInput = before
    ? `$last: Int!, $before: String`
    : `$first: Int!, $after: String`;
  const input = before
    ? `last: $last, before: $before`
    : `first: $first, after: $after`;
  const query = `
    query Products(${typeInput}, $query: String, $sortKey: ProductSortKeys!, $reverse: Boolean!) {
      products(${input}, query: $query, sortKey: $sortKey, reverse: $reverse) {
        edges {
          cursor
          node {
            id
            title
            handle
            description
            images(first: 10) {
              edges {
                node {
                  id
                  altText
                  originalSrc
                  transformedSrc(maxWidth: 800, crop: CENTER)
                }
              }
            }
          }
        }
        pageInfo {
           hasPreviousPage
           startCursor
           hasNextPage
           endCursor
        }
      }
    }
  `;
  const variable = before
    ? {
        last: parseInt(last),
        before: effectiveAfter,
      }
    : {
        first: parseInt(limit),
        after: effectiveAfter,
      };
  const response = await graphql(query, {
    variables: {
      ...variable,
      query: search ? `title:${search}*` : null,
      sortKey: getSort.sortKey,
      reverse: getSort.reverse,
    },
  });

  const responseJson = await response.json();

  const {
    data: { products },
  } = responseJson;

  return json(products);
};
