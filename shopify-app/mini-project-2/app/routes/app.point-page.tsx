import { TitleBar } from "@shopify/app-bridge-react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  InlineStack,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import PointTable from "../components/points/table";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import pointService from "app/services/point-service";
import { ALL_CODES, POINT } from "app/constrant/enum";
import {
  useActionData,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import {
  CursorType,
  MoneyToPointType,
  PointToVoucherType,
} from "app/validates/point";
import SkeletonTable from "app/components/points/skeletonTable";
import PointTableRedeem from "app/components/points/tableRedeem";
import ModalEarn from "app/components/points/modalEarn";
import { usePoint } from "app/hooks/usePoint";
import { Ires } from "app/interfaces/res";
import FormEarn from "app/components/points/FormEarn";
import DeleteScreen from "app/components/points/deleteScreen";
import ModalSpend from "app/components/points/modalSpend";
import FormSpend from "app/components/points/FormSpend";
import DeleteScreenSpend from "app/components/points/deleteScreenSpend";
import { useEffect } from "react";
import { CustomerRanking } from "app/interfaces/point";
import { authenticate } from "app/shopify.server";
import { getShop } from "app/helpers/getShop";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const getShopId = await getShop(shop);
  if (!getShopId) throw new Error("shopId not existed");
  // const { typeCursorEarn, id_earn, id_spend, typeCursorSpend } = params;
  const url = new URL(request.url);
  const typeCursorEarn = url.searchParams.get("typeCursorEarn");
  const id_earn = url.searchParams.get("id_earn");
  const typeCursorSpend = url.searchParams.get("typeCursorSpend");
  const id_spend = url.searchParams.get("id_spend");

  const getOrderToPoint = pointService.getAllPoint<{
    data: CustomerRanking[];
    cursor: CursorType;
  }>(
    ALL_CODES.EARN,
    typeCursorEarn == "before" ? "before" : "after",
    getShopId,
    id_earn,
  );
  const getPointTovoucher = pointService.getAllPoint<{
    data: PointToVoucherType[];
    cursor: CursorType;
  }>(
    ALL_CODES.SPEND,
    typeCursorSpend == "before" ? "before" : "after",
    getShopId,
    id_spend,
  );
  const [orderToPointResult, pointToVoucherResult] = await Promise.all([
    getOrderToPoint,
    getPointTovoucher,
  ]);

  if (
    orderToPointResult.EC == 0 &&
    pointToVoucherResult.EC == 0 &&
    orderToPointResult.DT &&
    pointToVoucherResult.DT
  ) {
    return json<{
      orderToPoint: CustomerRanking[] | undefined;
      pointToVoucher: PointToVoucherType[] | undefined;
      cursorMoneyToPoint: CursorType;
      cursorPointToVoucher: CursorType;
    }>({
      orderToPoint: orderToPointResult.DT?.data?.map((item) => {
        return {
          ...item,
          created_at: item.created_at
            ? new Date(item.created_at).toLocaleDateString("vi-VN")
            : undefined,
        };
      }),
      pointToVoucher: pointToVoucherResult.DT?.data.map((item) => {
        return {
          ...item,
          created_at: item.created_at
            ? new Date(item.created_at).toLocaleDateString("vi-VN")
            : undefined,
        };
      }),
      cursorMoneyToPoint: orderToPointResult.DT.cursor,
      cursorPointToVoucher: pointToVoucherResult.DT?.cursor,
    });
  } else {
    return json({
      orderToPoint: [],
      pointToVoucher: [],
      cursorMoneyToPoint: null,
      cursorPointToVoucher: null,
    });
  }
};
export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const getShopId = await getShop(shop);
  if (!getShopId) throw new Error("shopId not existed");
  const formData = await request.formData();
  const typeForm = formData.get(POINT.TYPE);

  const typeActions = formData.get(POINT.TYPE_ACTIONS);
  // if (typeActions == POINT.ADD) {
  const earnPoint =
    typeForm == POINT.EARN_POINT
      ? formData.get(POINT.EARN_POINT_DATA)!
      : formData.get(POINT.SPEND_POINT_DATA)!;
  if (typeof earnPoint !== "string") throw new Error("Invalid data");
  const jsonEarnPoint =
    typeForm == POINT.EARN_POINT
      ? (JSON.parse(earnPoint) as CustomerRanking & {
          type: string;
        })
      : (JSON.parse(earnPoint) as {
          moneyAmount: number;
          pointNumber: number;
          type: string;
          id?: number;
        });
  const { type, id, ...restObject } = jsonEarnPoint;

  const res =
    typeActions == POINT.ADD
      ? await pointService.createPoint(restObject, type, getShopId)
      : typeActions == POINT.UPDATE
        ? await pointService.updatePoint(id!, restObject, type)
        : await pointService.deletePoint(id!, type);
  return json<Ires<any>>(res);
}
const PointPage = () => {
  const {
    setEarnPoint,
    setTitle,
    title,
    setRakingCustomer,
    setModalOpenEarn,
    setModalOpenSpend,
    setSpendPoint,
  } = usePoint();
  const {
    cursorMoneyToPoint,
    orderToPoint,
    pointToVoucher,
    cursorPointToVoucher,
  } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (pointToVoucher?.length === 0) {
      newParams.delete("id_spend");
      newParams.delete("typeCursorSpend");
      navigate(`?${newParams.toString()}`, { preventScrollReset: true });
    }
    if (orderToPoint?.length == 0) {
      newParams.delete("id_earn");
      newParams.delete("typeCursorEarn");
      navigate(`?${newParams.toString()}`, { preventScrollReset: true });
    }
  }, [pointToVoucher, orderToPoint, searchParams, setSearchParams]);
  const navigation = useNavigation();
  const location = useLocation();
  const currentParams = new URLSearchParams(location.search);
  const nextParams = new URLSearchParams(navigation.location?.search ?? "");

  const isLoadingEarnPoint =
    navigation.state == "loading" &&
    navigation.formData === undefined &&
    navigation.location.pathname == location.pathname &&
    (currentParams.get("id_earn") !== nextParams.get("id_earn") ||
      currentParams.get("typeCursorEarn") !== nextParams.get("typeCursorEarn"));

  const isLoadingEarnSpend =
    navigation.state == "loading" &&
    navigation.formData === undefined &&
    navigation.location.pathname == location.pathname &&
    (currentParams.get("id_spend") !== nextParams.get("id_spend") ||
      currentParams.get("typeCursorSpend") !==
        nextParams.get("typeCursorSpend"));

  return (
    <>
      <Page>
        <TitleBar title="Point Management" />
        <Box>
          <InlineStack align="center">
            <Text as="h1" variant="heading3xl">
              Point Management
            </Text>
          </InlineStack>
        </Box>
        <Layout>
          <Layout.Section variant="fullWidth">
            <Card>
              <Text as="h2" variant="headingMd">
                Manage Point Earn
              </Text>
              <InlineStack align="end">
                <Button
                  variant="primary"
                  onClick={() => {
                    // setEarnPoint({
                    //   moneyAmount: 0,
                    //   condition: 0,
                    //   id: undefined,
                    // });
                    setRakingCustomer({
                      tierName: "",
                      pointRate: 0,
                      min_spent: 0,
                    });
                    setTitle(POINT.ADD);
                    setModalOpenEarn(true);
                  }}
                >
                  Add
                </Button>
              </InlineStack>
              {isLoadingEarnPoint ? (
                <SkeletonTable />
              ) : (
                Array.isArray(orderToPoint) &&
                !orderToPoint.every((item) => item === null) && (
                  <>
                    <PointTable
                      data={orderToPoint}
                      cursor={cursorMoneyToPoint}
                    />
                  </>
                )
              )}
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <Card>
              <Text as="h2" variant="headingMd">
                Manage Point Redeem
              </Text>
              <InlineStack align="end">
                <Button
                  variant="primary"
                  onClick={() => {
                    setSpendPoint({
                      moneyAmount: 0,
                      pointNumber: 0,
                      id: undefined,
                    });
                    setTitle(POINT.ADD);
                    setModalOpenSpend(true);
                  }}
                >
                  Add
                </Button>
              </InlineStack>
              {isLoadingEarnSpend ? (
                <SkeletonTable />
              ) : (
                Array.isArray(pointToVoucher) &&
                !pointToVoucher.every((item) => item === null) && (
                  <PointTableRedeem
                    data={pointToVoucher}
                    cursor={cursorPointToVoucher}
                  />
                )
              )}
            </Card>
          </Layout.Section>
        </Layout>
        <BlockStack></BlockStack>
      </Page>
      <ModalEarn>
        {title === POINT.DELETE ? <DeleteScreen /> : <FormEarn />}
      </ModalEarn>
      <ModalSpend>
        {title === POINT.DELETE ? <DeleteScreenSpend /> : <FormSpend />}
      </ModalSpend>
      <div style={{ width: "100%", height: "100px" }}></div>
    </>
  );
};

export default PointPage;
