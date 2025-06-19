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
import { ShieldNoneIcon } from "@shopify/polaris-icons";
import Filter from "app/components/customers/filter";
import Search from "app/components/customers/search";
import Table from "app/components/customers/table";
import FilterGroup from "app/components/filterGroup";
import SkeletonTable from "app/components/points/skeletonTable";
import { POINT } from "app/constrant/enum";
import { getShop } from "app/helpers/getShop";
import { IredeemData } from "app/interfaces/redeem";
import redeemService from "app/services/redeem-service";
import { authenticate } from "app/shopify.server";
import { CursorType } from "app/validates/point";

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
      redeems: [],
      cursor: null,
    });

  const response = await redeemService.getAllRedeemLogs({
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
      redeems: IredeemData[];
      cursor: CursorType;
    }>({
      EC,
      EM,
      redeems: restObject.DT.data,
      cursor: restObject.DT.cursor,
    });
  }
  return json({
    EC,
    EM,
    redeems: [],
    cursor: null,
  });
};
const RedeemManagement = () => {
  const { redeems, cursor } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const location = useLocation();
  const isLoading =
    navigation.state == "loading" &&
    navigation.formData === undefined &&
    navigation.location.pathname == location.pathname;
  const isValid =
    Array.isArray(redeems) && !redeems.every((item) => item === null);
  const rows =
    isValid && redeems.length > 0
      ? redeems.map((redeem) => {
          return [
            redeem.customer.firstName,
            redeem.customer.lastName,
            redeem.customer.email,
            redeem.code.code,
            redeem.code.isUsed ? (
              <Badge tone="success">true</Badge>
            ) : (
              <Badge tone="critical">false</Badge>
            ),
            redeem.point_used,
            redeem.amount,
            redeem.exchange.pointNumber,
            redeem.exchange.moneyAmount,
            new Date(redeem.created_at).toLocaleDateString("vi-VN"),
          ];
        })
      : [];
  const heading = [
    "firstName",
    "lastName",
    "email",
    "code",
    "isUsed",
    "pointUsed",
    "amount",
    "pointNumber",
    "moneyAmount",
    "created_at",
  ];

  return (
    <Page>
      <TitleBar title="Redeem Management" />
      <Box>
        <InlineStack align="center">
          <Text as="h1" variant="heading3xl">
            Redeem Management
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
                  label: "TRUE",
                  value: "true",
                },
                {
                  label: "FALSE",
                  value: "false",
                },
                {
                  label: "NONE",
                  value: "L4",
                  prefix: <Icon source={ShieldNoneIcon} tone="base" />,
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

export default RedeemManagement;
