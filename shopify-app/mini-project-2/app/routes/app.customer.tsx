import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import {
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigation,
} from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  BlockStack,
  Box,
  Button,
  Icon,
  InlineStack,
  Page,
  Text,
} from "@shopify/polaris";
import { ShieldNoneIcon } from "@shopify/polaris-icons";
import FilterCustomerForPoints from "app/components/customers/filter";
import ModalUpdateCustomer from "app/components/customers/modalUpdate";
import ModalUpdateRank from "app/components/customers/modalUpdateRank";
import SearchCustomer from "app/components/customers/search";
import CustomerTable from "app/components/customers/table";
import FilterGroup from "app/components/filterGroup";
import SkeletonTable from "app/components/points/skeletonTable";
import { POINT } from "app/constrant/enum";
import { REDIS } from "app/constrant/redis";
import { formatVND } from "app/helpers/formatMoney";
import { getShop } from "app/helpers/getShop";
import { useCommon } from "app/hooks/useCommon";
import { usePoint } from "app/hooks/usePoint";
import { CustomerRanking } from "app/interfaces/point";
import { initRedisNoSub } from "app/redis.server";
import customerService from "app/services/customer-service";
import redisService from "app/services/redis-service";
import { authenticate } from "app/shopify.server";
import { CursorType } from "app/validates/point";
import { customerType } from "app/validates/user";
import { useEffect, useState } from "react";
export type CustomerWithRank = customerType & {
  total_spent?: number;
  rank?: {
    tierName?: string;
    id: number;
  };
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const getShopId = await getShop(shop);
  if (!getShopId) throw new Error("shopId not existed");
  const url = new URL(request.url);
  const limit = url.searchParams.get("limit");
  const lastId = url.searchParams.get("lastId");
  const typeCursor = url.searchParams.get("typeCursor") as "after" | "before";
  const query = url.searchParams.get("query") ?? "";
  const orderBy = url.searchParams.get("orderBy");
  const group = url.searchParams.get("group") ?? "";
  const skip = url.searchParams.get("skip") ?? 0;
  // pointNext
  if ((lastId && isNaN(+lastId)) || (limit && isNaN(+limit)))
    return json({
      EC: 1,
      EM: "Limit or LastId  required a number",
      customers: [],
      cursor: null,
      listRank: [],
    });

  const response = await customerService.getAllUser({
    limit: limit,
    lastId: lastId,
    typeCursor: typeCursor === "before" ? "before" : "after",
    query,
    orderBy,
    group,
    shopId: getShopId,
    skip: +skip,
  });
  // const
  const { ST, EC, EM, ...restObject } = response;

  if (EC == 0 && restObject.DT) {
    return json<{
      EC: number;
      EM: string;
      customers: CustomerWithRank[];
      cursor: CursorType;
      listRank: CustomerRanking[];
    }>({
      EC,
      EM,
      customers: restObject.DT.data,
      cursor: restObject.DT.cursor,
      listRank: restObject.DT.listRank,
    });
  }
  return json({
    EC,
    EM,
    customers: [],
    cursor: null,
    listRank: [],
  });
};
export async function action({ request }: ActionFunctionArgs) {
  const {
    session,
    admin: { graphql },
  } = await authenticate.admin(request);
  const { shop } = session;
  const getShopId = await getShop(shop);
  if (!getShopId) throw new Error("shopId not existed");
  const formData = await request.formData();
  const syncData = formData.get(POINT.SYNC_DATA);
  if (syncData) {
    const getLargestUpdateData = (await redisService.getKey(
      `${REDIS.LAST_SYNC}-${getShopId}`,
    )) as any;
    let time = "";
    if (getLargestUpdateData.EC == 0 && getLargestUpdateData?.DT) {
      time = `(query: "updated_at:>'${getLargestUpdateData?.DT}'")`;
    }
    const query = `mutation {
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
                numberOfOrders
                state
                amountSpent {
                  amount
                  currencyCode
                }
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
    }`;

    const createBunkOperation = graphql(query);
    const [createBunkOperationResult] = await Promise.all([
      createBunkOperation,
    ]);
    if (!createBunkOperationResult.ok) {
      return json(
        {
          EC: 1,
          EM: "Sync data failed",
        },
        {
          status: 500,
        },
      );
    }
    return json(
      {
        EC: 0,
        EM: "Sync data under running. Please wait a bit minutes to finish it.",
      },
      {
        status: 200,
      },
    );
  }

  const type = formData.get(POINT.TYPE);
  let response;
  if (type == POINT.UPDATE_POINT) {
    const customerId = formData.get(POINT.CUSTOMER_ID) as string;
    const totalPoints = formData.get(POINT.TOTAL_POINTS) as string;
    const reason = formData.get(POINT.REASON) as string;
    if (!customerId || !totalPoints || !reason) {
      return json({ EC: 1, EM: "MISSING INPUT" }, 404);
    }
    response = await customerService.updatePointForUser({
      customerId: +customerId,
      amount: +totalPoints,
      reason,
      shopId: getShopId,
    });
  } else if (type == POINT.UPDATE_RANK) {
    const customerId = formData.get(POINT.CUSTOMER_ID) as string;
    const rankId = formData.get(POINT.RANKID) as string;

    if (!customerId || !rankId)
      return json({ EC: 1, EM: "MISSING INPUT" }, 404);
    response = await customerService.updateRankForUser(
      +customerId,
      +rankId,
      getShopId,
    );
  }

  const { ST, ...restObject } = response as any;
  return json(restObject, { status: ST });
}
const CustomerManagement = () => {
  const { cursor, customers, listRank } = useLoaderData<typeof loader>();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const location = useLocation();
  const { socket } = useCommon();
  useEffect(() => {
    socket?.on("allQueueDone", (data) => {
      shopify.toast.show(data);
      // console.log("all queue done", data);
    });
    return () => {
      socket?.off("allQueueDone");
    };
  }, [socket]);
  const isLoading =
    navigation.state == "loading" &&
    navigation.formData === undefined &&
    navigation.location.pathname == location.pathname;
  const isValid =
    Array.isArray(customers) && !customers.every((item) => item === null);
  const rows =
    isValid && customers.length > 0
      ? customers.map((customer) => {
          return [
            customer.firstName,
            customer.lastName,
            customer.email,
            customer.total_point ?? 0,
            formatVND(customer.total_spent ?? 0),
            customer.rank?.tierName ?? "",
            new Date(customer.created_at ?? "").toLocaleDateString("vi-VN"),
            <Button
              variant="primary"
              onClick={() => {
                if (customer) {
                  hanldeClickUpdateCustomer(
                    customer.id ?? 0,
                    customer.total_point ?? 0,
                    customer.rank?.id ?? 0,
                  );
                }
              }}
            >
              Update
            </Button>,
            <Button
              onClick={() => {
                setSelectedCustomer({
                  id: customer.id ?? 0,
                  totalPoints: customer.total_point ?? 0,
                  rankId: customer.rank?.id ?? 0,
                });
                setOpenModalUpdateRank(true);
              }}
            >
              Update
            </Button>,
          ];
        })
      : [];
  const heading = [
    "FirstName",
    "LastName",
    "Email",
    "Total_point",
    "TotalSpent",
    "Rank",
    "Created_at",
    "Update Point",
    "Update Rank",
  ];

  const { setSelectedCustomer, setOpenModalUpdate, setOpenModalUpdateRank } =
    usePoint();
  const hanldeClickUpdateCustomer = (
    cId: number,
    totalPoints: number,
    rId: number,
  ) => {
    setSelectedCustomer({
      id: cId,
      totalPoints: totalPoints,
      rankId: rId,
    });
    setOpenModalUpdate(true);
    // console.log(cId, totalPoint);
  };
  const [options, setOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  useEffect(() => {
    if (
      listRank &&
      Array.isArray(listRank) &&
      !listRank.every((item) => item === null)
    )
      setOptions(
        listRank.map((item) => {
          return {
            label: item.tierName,
            value: item.id ? item.id.toString() : "1",
          };
        }),
      );
  }, [listRank]);
  // const options = listRank.map((item) => {
  //   return {
  //     label: item.tierName,
  //     value: item.id ? item.id.toString() : "1",
  //   };
  // });
  const fetcher = useFetcher();
  const handleSyncData = () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(POINT.SYNC_DATA, POINT.CUSTOMER_ID);
      fetcher.submit(formData, { method: "POST" });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (fetcher.state == "idle" && fetcher.data) {
      setLoading(false);
      const { EC, EM } = fetcher.data as any;
      if (EC == 0) {
        shopify.toast.show(EM);
      } else {
        shopify.toast.show(EM, {
          isError: true,
        });
      }
    }
  }, [fetcher]);
  return (
    <>
      <Page>
        <TitleBar title="Customer Management" />
        <Box>
          <InlineStack align="center">
            <Text as="h1" variant="heading3xl">
              Customer Management
            </Text>
          </InlineStack>
        </Box>
        <BlockStack gap={"400"}>
          <InlineStack align="start" gap={"300"}>
            <Box width="23%">
              <SearchCustomer />
            </Box>
            <Box width="23%">
              <FilterCustomerForPoints />
            </Box>
            <Box width="23%">
              <FilterGroup
                options={[
                  {
                    label: "NONE",
                    value: "L4",
                    prefix: <Icon source={ShieldNoneIcon} tone="base" />,
                  },
                  ...options,
                  // ...groupRows,
                ]}
              />
            </Box>
            <Box width="23%">
              <BlockStack gap={"100"}>
                <Text as="h2">Sync data</Text>
                <Button
                  variant="primary"
                  onClick={handleSyncData}
                  loading={loading}
                >
                  Sync data
                </Button>
              </BlockStack>
            </Box>
          </InlineStack>
          {isLoading ? (
            <SkeletonTable />
          ) : (
            cursor && (
              <CustomerTable rows={rows} heading={heading} cursor={cursor} />
            )
          )}
        </BlockStack>
        <ModalUpdateCustomer />
        <ModalUpdateRank options={options} />
        {/* <ModalDelete */}
      </Page>
    </>
  );
};
export default CustomerManagement;
