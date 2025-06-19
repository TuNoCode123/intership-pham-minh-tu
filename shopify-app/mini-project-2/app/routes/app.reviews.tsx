import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import {
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigation,
} from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Icon,
  InlineStack,
  Page,
  Text,
} from "@shopify/polaris";
import Filter from "app/components/customers/filter";
import Search from "app/components/customers/search";
import Table from "app/components/customers/table";
import SkeletonTable from "app/components/points/skeletonTable";
import { Location_Api, POINT, REVIEW } from "app/constrant/enum";
import { Ireviews } from "app/interfaces/reviews";
import reviewService from "app/services/review-service";
import { CursorType } from "app/validates/point";
import { ShieldNoneIcon, StarFilledIcon } from "@shopify/polaris-icons";
import FilterGroupReviews from "app/components/filterGroup";
import { useReview } from "app/hooks/useReview";
import { ModalApproved } from "app/components/reviews/modal";
import { Iresponse, IresRouter } from "app/interfaces/api";
import { useEffect, useState } from "react";
import ModalDetailReview from "app/components/reviews/modalDetailReview";
import DeleteReviewModal from "app/components/reviews/modalDeleteReview";
import { getSocket } from "app/helpers/socket";
import { authenticate } from "app/shopify.server";
import { getShop } from "app/helpers/getShop";

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
      reviews: [],
      cursor: null,
    });

  const response = await reviewService.getAllReviews({
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
      reviews: Ireviews[];
      cursor: CursorType;
    }>({
      EC,
      EM,
      reviews: restObject.DT.data,
      cursor: restObject.DT.cursor,
    });
  }
  return json({
    EC,
    EM,
    reviews: [],
    cursor: null,
  });
};
export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const getShopId = await getShop(shop);
  if (!getShopId) throw new Error("shopId not existed");
  const formData = await request.formData();
  const idReview = formData.get(REVIEW.APPROVED);
  const state = formData.get(REVIEW.STATE);
  const rating = formData.get(REVIEW.RATING);
  const customerId = formData.get(REVIEW.CUSTOMER_ID);
  if (!idReview || !state || !rating || !customerId) {
    return json<IresRouter>(
      {
        EC: 1,
        EM: "MISSING INPUT",
      },
      { status: 400 },
    );
  }
  const res = await reviewService.changeStateReviews({
    idReview: +idReview,
    state: state == "true",
    rating: +rating,
    customerId: +customerId,
    shopId: getShopId,
  });
  const { ST, ...restObject } = res;
  return json<IresRouter>(restObject, { status: ST });
}
const ReviewManagement = () => {
  const { reviews, cursor } = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const isLoading =
    navigation.state == "loading" &&
    navigation.formData === undefined &&
    navigation.location.pathname == location.pathname;
  const isValid =
    Array.isArray(reviews) && !reviews.every((item) => item === null);
  const {
    openModalApproved,
    approved,
    setApproved,
    setSelectedReview,
    setDetailReview,
    openModalDetailReview,
    setCurrentApi,
    currentApi,
    openModalReviewDelete,
  } = useReview();
  const changeStateClick = (review: Ireviews) => {
    openModalApproved();
    setApproved(review.approved ? REVIEW.UN_APPROVED : REVIEW.APPROVED);
    setSelectedReview(review);
  };
  const fetcher = useFetcher();
  const [selectedId, setSelectedId] = useState<number>();
  const handleOnclickViewDetail = (id: number) => {
    setLoading(true);
    setCurrentApi(Location_Api.DETAIL_REVIEW);
    setSelectedId(id);
    fetcher.load(`/app/api/review/${id}`);
  };
  const handleOnlickDeleteReview = (review: Ireviews) => {
    setCurrentApi(Location_Api.DELETE_REVIEW);
    setSelectedReview(review);
    openModalReviewDelete();
  };
  useEffect(() => {
    if (fetcher.state == "idle") {
      const data = fetcher.data as Iresponse<Ireviews>;
      if (data && currentApi == Location_Api.DETAIL_REVIEW) {
        if (data.EC == 0) {
          console.log("open detail");
          setDetailReview(data.DT);
          //   closeModalApproved();
          openModalDetailReview();
        } else {
          shopify.toast.show(data.EM, {
            isError: true,
          });
        }
      }
      setLoading(false);
    }
  }, [fetcher]);

  const rows =
    isValid && reviews.length > 0
      ? reviews.map((review) => {
          return [
            review.product_id,
            review.customers.firstName,
            review.customers.lastName,
            review.customers.email,
            <InlineStack gap={"0"} align="end">
              <Box> {review.rating}</Box>
              <Icon source={StarFilledIcon} tone="base" />
            </InlineStack>,
            review.award,
            review.approved ? (
              <Badge tone="success">True</Badge>
            ) : (
              <Badge tone="critical">False</Badge>
            ),
            new Date(review.created_at).toLocaleDateString("vi-VN"),
            <Button
              onClick={() => changeStateClick(review)}
              variant={review.approved ? "primary" : "primary"}
              tone={review.approved ? "critical" : "success"}
            >
              {review.approved ? "UnApproved" : "Approved"}
            </Button>,
            <Button
              variant="primary"
              onClick={() => handleOnclickViewDetail(review.id)}
              loading={
                loading &&
                selectedId == review.id &&
                currentApi === Location_Api.DETAIL_REVIEW
              }
            >
              View
            </Button>,
            <Button
              variant="secondary"
              tone="critical"
              onClick={() => handleOnlickDeleteReview(review)}
              loading={
                loading &&
                selectedId == review.id &&
                currentApi === Location_Api.DELETE_REVIEW
              }
            >
              Delete
            </Button>,
          ];
        })
      : [];
  const heading = [
    "product_id",
    "firstName",
    "lastName",
    "email",
    "rating",
    "award",
    "approved",
    "created_at",
    "Approve",
    "view",
    "Delete",
  ];
  const groupRows = Array.from({ length: 5 }).map((_, i) => {
    return {
      label: `${i + 1}`,
      value: `rating-${i + 1}`,
      prefix: <Icon source={StarFilledIcon} tone="base" />,
    };
  });

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
            <FilterGroupReviews
              options={[
                {
                  label: "Approved",
                  value: "approved-true",
                },
                {
                  label: "UnApproved",
                  value: "approved-false",
                },
                {
                  label: "NONE",
                  value: "L4",
                  prefix: <Icon source={ShieldNoneIcon} tone="base" />,
                },
                ...groupRows,
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
      <ModalApproved
        title={approved == REVIEW.APPROVED ? "Approved" : "UnApproved"}
      />
      <ModalDetailReview />
      <DeleteReviewModal />
    </Page>
  );
};

export default ReviewManagement;
