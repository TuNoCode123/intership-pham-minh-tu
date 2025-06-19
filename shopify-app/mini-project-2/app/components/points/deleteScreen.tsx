import { useFetcher } from "@remix-run/react";
import { Button, InlineStack, Page, Text } from "@shopify/polaris";
import { POINT } from "app/constrant/enum";
import { usePoint } from "app/hooks/usePoint";
import { Ires } from "app/interfaces/res";
import { useEffect, useState } from "react";

const DeleteScreen = () => {
  const { earnPoint, setModalOpenEarn, rankingCustomer } = usePoint();
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(false);
  const hanldeDelete = () => {
    if (!rankingCustomer) return;
    setLoading(true);
    const formData = new FormData();
    formData.set(
      POINT.EARN_POINT_DATA,
      JSON.stringify({
        id: rankingCustomer.id,
        type: "L1",
      }),
    );
    formData.set(POINT.TYPE_ACTIONS, POINT.DELETE);
    formData.set(POINT.TYPE, POINT.EARN_POINT);
    fetcher.submit(formData, { method: "POST" });
  };
  useEffect(() => {
    if (fetcher.state == "idle" && fetcher.data) {
      const data = fetcher.data as Ires<any>;
      if (data && data?.EC == 0) {
        shopify.toast.show(data?.EM);
        setLoading(false);
        setModalOpenEarn(false);
      } else {
        shopify.toast.show(data?.EM, {
          isError: true,
        });
        setLoading(false);
      }
    }
  }, [fetcher]);
  return (
    <>
      <Page>
        <Text as="h1" variant="headingMd">
          Are you sure you want to delete this item havine TierrName=
          {rankingCustomer?.tierName}?
        </Text>
        <InlineStack align="end">
          <Button variant="primary" onClick={hanldeDelete} loading={loading}>
            Delete
          </Button>
        </InlineStack>
      </Page>
    </>
  );
};

export default DeleteScreen;
