import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import { Card, Layout, Page } from "@shopify/polaris";
import CardDashBoard, {
  Ibadge,
} from "app/components/dashboards/card_dashboard";
import { authenticate } from "app/shopify.server";
import { IproductDetail } from "interfaces/product";
import invariant from "tiny-invariant";
import {
  ProductIcon,
  ArrowUpIcon,
  InventoryFilledIcon,
  CartSaleIcon,
} from "@shopify/polaris-icons";
import { VARIANTS } from "app/constraints/variants";
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const {
    admin: { graphql },
    session,
  } = await authenticate.admin(request);
  invariant(session.shop, "Shop not found");

  const response = await graphql(`
    #graphql
    query {
      productsCount {
        count
      }
      products(first: 250) {
        edges {
          node {
            totalInventory
            variants(first: 100) {
              edges {
                node {
                  id
                  price
                  compareAtPrice
                  title
                  inventoryQuantity
                }
              }
            }
          }
        }
      }
    }
  `);
  invariant(response.ok, "query error");
  const responseJson = await response.json();
  const {
    data: {
      products: { edges },
      productsCount: { count },
    },
  } = responseJson;
  return json<{
    edges: {
      node: IproductDetail;
    }[];
    count: number;
  }>({ edges, count });
};
const StatisticProduct = () => {
  const { edges, count } = useLoaderData<typeof loader>();
  let productSaleCount = 0;
  let totalVariants = 0;
  edges.length > 0 &&
    edges.map((item) => {
      const {
        node: {
          variants: { edges: DetailVariant },
        },
      } = item;
      let isValidVariant = false;

      if (DetailVariant.length > 0)
        DetailVariant.map((v) => {
          const {
            node: { price, compareAtPrice, title },
          } = v;
          if (title !== VARIANTS.DEFAULT_TITLE) isValidVariant = true;
          if (+price < +compareAtPrice) productSaleCount++;
        });
      if (isValidVariant) totalVariants += DetailVariant.length;
    });
  const listItems = [
    {
      title: "Số sản phẩm đang có",
      badgeTitle: {
        tone: "success",
        icon: {
          source: ProductIcon,
          tone: "success",
        },
      } as Ibadge,
      quantity: count,

      description: "Tổng số sản phẩm chính trong app",
      totalVariant: "Tổng số sản phẩm con trong kho là: " + totalVariants,
    },
    {
      title: "Tổng tồn kho",
      badgeTitle: {
        tone: "success",
        icon: {
          source: InventoryFilledIcon,
          tone: "success",
        },
      } as Ibadge,
      quantity: edges.reduce((acc, item) => acc + item.node.totalInventory, 0),

      description: "Số lượng sản phẩm trong kho",
    },
    {
      title: "Sản phẩm giảm giá",
      badgeTitle: {
        tone: "success",
        icon: {
          source: CartSaleIcon,
          tone: "success",
        },
      } as Ibadge,
      quantity: productSaleCount,

      description: "Sản phẩm đang có khuyến mãi",
    },
  ];
  return (
    <Page fullWidth>
      <TitleBar title="DashBoard" />
      <Layout>
        {listItems.map((item, index) => {
          return (
            <>
              <Layout.Section key={index} variant={"oneThird"}>
                <Card>
                  <CardDashBoard
                    title={item.title}
                    quantity={item.quantity}
                    badgeTitle={item.badgeTitle}
                    description={item.description}
                    totalVariant={item.totalVariant ? item.totalVariant : ""}
                  />
                </Card>
              </Layout.Section>
            </>
          );
        })}
      </Layout>
    </Page>
  );
};

export default StatisticProduct;
