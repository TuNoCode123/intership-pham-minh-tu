import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useLocation, useNavigation } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Badge,
  BlockStack,
  Box,
  Icon,
  InlineStack,
  Page,
  Text,
} from "@shopify/polaris";
import {
  ExchangeIcon,
  OrderDraftIcon,
  PaymentIcon,
  ShieldNoneIcon,
} from "@shopify/polaris-icons";
import Filter from "app/components/customers/filter";
import Search from "app/components/customers/search";
import Table from "app/components/customers/table";
import FilterGroup from "app/components/filterGroup";
import SkeletonTable from "app/components/points/skeletonTable";

import { POINT } from "app/constrant/enum";
import { getShop } from "app/helpers/getShop";
import { ITransaction } from "app/interfaces/point";
import transactionService from "app/services/transaction-service";
import { authenticate } from "app/shopify.server";
import { CursorType, PointLog } from "app/validates/point";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const getShopId = await getShop(shop);
  if (!getShopId) throw new Error("shopId not existed");
  const url = new URL(request.url);
  const limit = url.searchParams.get("limit") ?? 5;
  const lastId = url.searchParams.get("lastId");
  const typeCursor = url.searchParams.get("typeCursor") as "after" | "before";
  const query = url.searchParams.get("query") ?? "";
  const orderBy = url.searchParams.get("orderBy");
  const skip = url.searchParams.get("skip") ?? 0;
  const group = url.searchParams.get("group") ?? "";
  // pointNext
  if ((lastId && isNaN(+lastId)) || (limit && isNaN(+limit)))
    return json({
      EC: 1,
      EM: "Limit or LastId  required a number",
      pointLogs: [],
      cursor: null,
    });

  const response = await transactionService.getTransactions({
    limit: limit,
    lastId: lastId,
    typeCursor: typeCursor === "before" ? "before" : "after",
    query,
    group,
    shopId: getShopId,
    // query,
    orderBy,
    skip: +skip,
  });
  const { ST, EC, EM, ...restObject } = response;

  if (EC == 0 && restObject.DT) {
    return json<{
      EC: number;
      EM: string;
      pointLogs: ITransaction[];
      cursor: CursorType;
    }>({
      EC,
      EM,
      pointLogs: restObject.DT.data,
      cursor: restObject.DT.cursor,
    });
  }
  return json({
    EC,
    EM,
    pointLogs: [],
    cursor: null,
  });
};
const PointTransactionHistory = () => {
  const { EC, EM, cursor, pointLogs } = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const location = useLocation();
  console.log("pointLogs", pointLogs);
  const isLoading =
    navigation.state == "loading" &&
    navigation.formData === undefined &&
    navigation.location.pathname == location.pathname;
  const isValid =
    Array.isArray(pointLogs) && !pointLogs.every((item) => item === null);
  const rows = isValid
    ? pointLogs.map((pointLog) => {
        return [
          pointLog.customer.firstName,
          pointLog.customer.lastName,
          pointLog.customer.email,
          pointLog.type == "L1" ? (
            <Badge tone="success">{pointLog.allCode.value}</Badge>
          ) : pointLog.type == "L2" ? (
            <Badge tone="attention">{pointLog.allCode.value}</Badge>
          ) : (
            <Badge tone="warning">{pointLog.allCode.value}</Badge>
          ),
          pointLog.reason,
          pointLog.amount ?? 0,
          new Date(pointLog.created_at).toLocaleDateString("vi-VN"),
        ];
      })
    : [];
  const heading = isValid
    ? pointLogs.length > 0
      ? Object.keys(
          pointLogs.map((item) => {
            const { type, reason, amount } = item;
            return {
              firstName: "",
              lastName: "",
              email: "",
              type,
              reason,
              amount,
              created_at: "",
            };
          })[0],
        )
      : []
    : [];
  return (
    <Page>
      <TitleBar title="Point Logs Management" />
      <Box>
        <InlineStack align="center">
          <Text as="h1" variant="heading3xl">
            Point Logs Management
          </Text>
        </InlineStack>
      </Box>
      <BlockStack gap={"400"}>
        <InlineStack align="start" gap={"300"}>
          <Box width="48%">
            <Search />
          </Box>
          <Box width="23%">
            <Filter />
          </Box>
          <Box width="25%">
            <FilterGroup
              options={[
                {
                  label: "NONE",
                  value: "L4",
                  prefix: <Icon source={ShieldNoneIcon} tone="base" />,
                },
                {
                  label: "SPEND",
                  value: "L2",
                  prefix: <Icon source={OrderDraftIcon} tone="base" />,
                },
                {
                  label: "EXCHANGE",
                  value: "L3",
                  prefix: <Icon source={ExchangeIcon} tone="base" />,
                },
                {
                  label: "EARN",
                  value: "L1",
                  prefix: <Icon source={PaymentIcon} tone="base" />,
                },
                {
                  label: "REVIEW",
                  value: "L7",
                  prefix: <Icon source={PaymentIcon} tone="base" />,
                },
                {
                  label: "ADMIN_UPDATE",
                  value: "L8",
                  prefix: <Icon source={PaymentIcon} tone="base" />,
                },
              ]}
            />
          </Box>
        </InlineStack>
        {isLoading ? (
          <SkeletonTable />
        ) : (
          cursor && (
            <Table
              rows={rows}
              heading={heading}
              cursor={cursor}
              type={POINT.LOG}
            />
          )
        )}
      </BlockStack>
    </Page>
  );
};

export default PointTransactionHistory;
