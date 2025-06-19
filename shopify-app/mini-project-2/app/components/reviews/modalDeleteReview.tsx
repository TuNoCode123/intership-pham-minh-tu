import { useFetcher } from "@remix-run/react";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { BlockStack, Button, InlineStack, Page } from "@shopify/polaris";
import { Location_Api, REVIEW } from "app/constrant/enum";
import { useReview } from "app/hooks/useReview";
import { Iresponse } from "app/interfaces/api";
import { useEffect, useState } from "react";
const DeleteReviewModal = () => {
  const shopify = useAppBridge();
  const {
    closeModalReviewDelete,
    modalOpenReviewDelete,
    selectedReview,
    currentApi,
  } = useReview();
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(false);
  const onclickSubmit = () => {
    if (selectedReview) {
      setLoading(true);
      fetcher.submit(
        {},
        {
          method: "DELETE",
          encType: "application/json",
          action: `/app/api/review/${selectedReview?.id}`,
        },
      );
    }
  };
  useEffect(() => {
    if (fetcher.state == "idle" && currentApi == Location_Api.DELETE_REVIEW) {
      const data = fetcher.data as Iresponse<any>;
      if (data) {
        const { EC, EM } = data;
        if (EC == 0) {
          shopify.toast.show(EM);
          closeModalReviewDelete();
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
    <Modal
      id="modal-review-detail"
      onHide={closeModalReviewDelete}
      open={modalOpenReviewDelete}
    >
      <Page>
        <BlockStack gap={"300"}>
          Are you sure delete this reviews?
          {/* {detailReview && <DetailReview review={detailReview} />} */}
          <InlineStack align="end" gap={"300"}>
            <Button
              variant="primary"
              onClick={closeModalReviewDelete}
              tone="critical"
            >
              Close
            </Button>
            <Button variant="primary" onClick={onclickSubmit} loading={loading}>
              Submit
            </Button>
          </InlineStack>
        </BlockStack>
      </Page>
      <TitleBar title={`Detail Review`}></TitleBar>
    </Modal>
  );
};

export default DeleteReviewModal;
