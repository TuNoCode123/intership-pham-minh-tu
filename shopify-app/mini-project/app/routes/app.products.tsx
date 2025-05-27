import { json, LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData,
  useLocation,
  useNavigation,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import {
  Link,
  Page,
  LegacyCard,
  DataTable,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonThumbnail,
  InlineError,
} from "@shopify/polaris";
import { authenticate } from "app/shopify.server";
import { Iproduct } from "interfaces/product";
import React, { useEffect } from "react";
import invariant from "tiny-invariant";
import { Thumbnail } from "@shopify/polaris";
import { NoteIcon } from "@shopify/polaris-icons";
import SearchProduct from "app/components/pages/products/search";
import { ENUM_PARAMS } from "app/constraints/params";
import SkeletonProductTable from "app/components/pages/products/skeletons/skeletonTable";
import SkeletonPageComponent from "app/components/pages/products/skeletons/skeletonPage";
import { useProduct } from "app/hooks/useProduct";

// import { getIdProduct } from "untils/getIdProduct";
export interface IOption {
  label: string;
  value: string;
}
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const {
    admin: { graphql },
    session,
  } = await authenticate.admin(request);
  invariant(session.shop, "Shop not found");
  const url = new URL(request.url);
  const search = url.searchParams.get(ENUM_PARAMS.SEARCH);
  const afterParam = url.searchParams.get(ENUM_PARAMS.AFTER);
  const beforeParam = url.searchParams.get(ENUM_PARAMS.BEFORE);
  const typeInput = afterParam
    ? `Products($first:Int!, $after: String, $query: String) `
    : beforeParam
      ? `Products($last:Int!, $before: String, $query: String) `
      : `Products($query: String) `;
  const input = afterParam
    ? `first: $first, after: $after, query:$query`
    : beforeParam
      ? `last: $last, before: $before, query:$query`
      : `first: 2, query:$query`;
  const variables: any = {};

  if (afterParam) {
    variables.after = afterParam;
    variables.first = 2;
  }
  if (beforeParam) {
    variables.before = beforeParam;
    variables.last = 2;
  }
  if (search) {
    variables.query = `title:${search}*`;
  }
  const query = `
    query ${typeInput}{
      products(${input}) {
        edges {
          cursor
          node {
            id
            title
            handle
            description
            totalInventory
            priceRangeV2 {
              maxVariantPrice {
                amount
                currencyCode
              }
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
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
  const response = await graphql(query, {
    variables,
  });
  const responseJson = await response.json();

  const {
    data: { products },
  } = responseJson;

  return json<Iproduct>(products);
};

export default function DataTableProduct() {
  const products = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const location = useLocation();

  const loading =
    navigation.state === "loading" &&
    navigation.formData === undefined &&
    navigation.location.pathname === location.pathname;
  const loadingPage =
    navigation.state === "loading" &&
    navigation.formData === undefined &&
    navigation.location.pathname !== location.pathname;
  const { pageInfo } = products;
  const [searchParams, setSearchParams] = useSearchParams();
  const pageInfor = products.pageInfo;
  const handleOnNext = (cursor: string) => {
    searchParams.delete(ENUM_PARAMS.BEFORE);
    searchParams.set(ENUM_PARAMS.AFTER, cursor);
    setSearchParams(searchParams);
  };
  const handleOnPrivious = (cursor: string) => {
    searchParams.delete(ENUM_PARAMS.AFTER);
    searchParams.set(ENUM_PARAMS.BEFORE, cursor);
    setSearchParams(searchParams);
  };
  const { setListVariants } = useProduct();
  // a;
  // const { pageInfor, handleOnNext } = usePagination(products.pageInfo);
  const options: IOption[] = [];
  const productRows = products.edges.map((product) => {
    const {
      node: {
        id,
        title,
        totalInventory,
        priceRangeV2,
        description,
        images: { edges },
      },
    } = product;
    const isExistedItem = options.find(
      (item) => item.label == title || item.label == description,
    );
    if (!isExistedItem) {
      const tmp: IOption[] = [
        {
          label: title,
          value: title,
        },
      ];
      const trunscatedDescription =
        description.length > 50
          ? description.slice(0, 50) + "..."
          : description;
      if (trunscatedDescription != "") {
        tmp.push({
          label: trunscatedDescription,
          value: trunscatedDescription,
        });
      }
      options.push(...tmp);
    }

    const image =
      edges.length > 0 ? (
        <div>
          <Thumbnail
            source={edges[0].node.transformedSrc || edges[0].node.originalSrc}
            alt={title}
            size="small"
          />
        </div>
      ) : (
        <div>
          <Thumbnail source={NoteIcon} size="small" alt={title} />
        </div>
      );
    const price = `${priceRangeV2.minVariantPrice.amount} - ${priceRangeV2.maxVariantPrice.amount} ${priceRangeV2.minVariantPrice.currencyCode} `;
    const titleLink = (
      <Link removeUnderline url={`/app/product/${btoa(id)}`} key={id}>
        {title}
      </Link>
    );
    const trunscatedDescription =
      description.length > 50 ? description.slice(0, 50) + "..." : description;
    return [image, titleLink, price, totalInventory, trunscatedDescription];
  });
  useEffect(() => {
    setListVariants({});
  }, []);
  return loadingPage ? (
    <>
      <SkeletonPageComponent />
    </>
  ) : (
    <>
      <div style={{ padding: "10px" }}>
        <Page>
          <SearchProduct options={options} />
        </Page>
        {loading ? (
          <SkeletonProductTable />
        ) : (
          <>
            <Page title="Sales by product">
              <LegacyCard>
                <DataTable
                  columnContentTypes={[
                    "text",
                    "numeric",
                    "numeric",
                    "numeric",
                    "numeric",
                  ]}
                  headings={[
                    "Image",
                    "title",
                    "Price Range",
                    "Quantity",
                    "description",
                  ]}
                  rows={productRows}
                  pagination={{
                    hasNext: pageInfo.hasNextPage,
                    hasPrevious: pageInfo.hasPreviousPage,
                    onNext: () => handleOnNext(pageInfor.endCursor),
                    onPrevious: () => handleOnPrivious(pageInfor.startCursor),
                  }}
                />
              </LegacyCard>
            </Page>
          </>
        )}
        {/* {navigation.state == "loading" ? <></> : <></>} */}
      </div>
    </>
  );
}
export function ErrorBoundary() {
  const error = useRouteError(); // Lấy thông tin lỗi
  // Xử lý lỗi JavaScript
  if (error instanceof Error) {
    return (
      <div className="error-container" style={{ padding: "10px" }}>
        <h1>Đã xảy ra lỗi</h1>
        <InlineError message={error.message} fieldID="myFieldID" />
      </div>
    );
  }

  return (
    <div className="text-red-600">
      <div className="error-container">
        <h1>Lỗi không xác định</h1>
        <p>Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.</p>
      </div>
    </div>
  );
}
