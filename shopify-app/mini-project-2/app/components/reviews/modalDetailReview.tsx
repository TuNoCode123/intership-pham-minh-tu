import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { BlockStack, Button, InlineStack, Page } from "@shopify/polaris";
import { useReview } from "app/hooks/useReview";

import DetailReview from "./detailReviewPage";

export default function ModalDetailReview() {
  const { modalOpenDetailReview, closeModalDetailReview, detailReview } =
    useReview();

  //   const fetcher = useFetcher();
  //   const [loading, setLoading] = useState(false);
  //   const onclickSubmit = () => {
  //     if (selectedReview) {
  //       setLoading(true);
  //       const formData = new FormData();
  //       formData.set(REVIEW.APPROVED, selectedReview?.id + "");
  //       formData.set(REVIEW.STATE, selectedReview.approved ? "false" : "true");
  //       formData.set(REVIEW.RATING, selectedReview?.rating + "");
  //       formData.set(REVIEW.CUSTOMER_ID, selectedReview?.customer_id + "");
  //       fetcher.submit(formData, { method: "POST" });
  //     }
  //   };
  //   useEffect(() => {
  //     if (fetcher.state == "idle") {
  //       closeModalApproved();
  //       setLoading(false);
  //     }
  //   }, [fetcher]);
  return (
    <>
      <Modal
        id="modal-review-detail"
        onHide={closeModalDetailReview}
        open={modalOpenDetailReview}
      >
        <Page>
          <BlockStack gap={"300"}>
            {detailReview && <DetailReview review={detailReview} />}
            <InlineStack align="end">
              <Button variant="primary" onClick={closeModalDetailReview}>
                Close
              </Button>
            </InlineStack>
          </BlockStack>
        </Page>
        <TitleBar title={`Detail Review`}></TitleBar>
      </Modal>
    </>
  );
}
