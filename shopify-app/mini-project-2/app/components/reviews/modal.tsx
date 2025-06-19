import { useEffect, useState } from "react";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { BlockStack, Button, InlineStack, Page, Text } from "@shopify/polaris";
import { useReview } from "app/hooks/useReview";
import { useFetcher } from "@remix-run/react";
import { Location_Api, REVIEW } from "app/constrant/enum";
import { Iresponse } from "app/interfaces/api";
import { useCommon } from "app/hooks/useCommon";

export function ModalApproved({ title }: { title: string }) {
  const {
    modalOpenApproved,
    closeModalApproved,
    selectedReview,
    setCurrentApi,
    currentApi,
  } = useReview();
  const { socket } = useCommon();
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const [loading, setLoading] = useState(false);
  const onclickSubmit = () => {
    if (selectedReview) {
      setLoading(true);
      setCurrentApi(Location_Api.CHANGE_REVIEW_STATE);
      const formData = new FormData();
      formData.set(REVIEW.APPROVED, selectedReview?.id + "");
      formData.set(REVIEW.STATE, selectedReview.approved ? "false" : "true");
      formData.set(REVIEW.RATING, selectedReview?.rating + "");
      formData.set(REVIEW.CUSTOMER_ID, selectedReview?.customer_id + "");
      fetcher.submit(formData, { method: "POST" });
    }
  };
  useEffect(() => {
    if (fetcher.state == "idle") {
      const data = fetcher.data as Iresponse<any>;
      if (data && currentApi === Location_Api.CHANGE_REVIEW_STATE) {
        const { EC, EM } = data;
        if (EC == 0) {
          if (socket) {
            console.log("emitSocket");
            socket.emit("approvedReview", {
              customerId: selectedReview?.customers?.customerId,
              state: selectedReview?.approved ? false : true,
            });
          }
          shopify.toast.show(EM);
          closeModalApproved();
        } else {
          shopify.toast.show(EM, {
            isError: true,
          });
        }
      }
      setLoading(false);
    }
  }, [fetcher]);
  return (
    <>
      <Modal id="my-modal" onHide={closeModalApproved} open={modalOpenApproved}>
        <Page>
          <BlockStack>
            <Text as="h3">Are you sure {title} this review? </Text>
            <InlineStack align="end">
              <Button
                variant="primary"
                onClick={onclickSubmit}
                loading={loading}
              >
                Submit
              </Button>
            </InlineStack>
          </BlockStack>
        </Page>
        <TitleBar title={`${title} Review`}></TitleBar>
      </Modal>
    </>
  );
}
