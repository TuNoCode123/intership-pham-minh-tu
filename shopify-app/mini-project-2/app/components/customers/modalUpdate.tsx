import { useFetcher } from "@remix-run/react";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import {
  BlockStack,
  Button,
  InlineStack,
  Page,
  TextField,
} from "@shopify/polaris";
import { POINT } from "app/constrant/enum";
import { usePoint } from "app/hooks/usePoint";
import { useCallback, useEffect, useState } from "react";

export function ModalUpdateCustomer() {
  const shopify = useAppBridge();
  const {
    modalOpenUpdate,
    setOpenModalUpdate,
    selectedCustomer,
    setSelectedCustomer,
  } = usePoint();
  const [value, setValue] = useState("UPDATE EXTRA POINT FOR EVENT");
  const fetcher = useFetcher();
  const handleChange = useCallback(
    (newValue: string) => setValue(newValue),
    [],
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const handleSubmitUpdatePoint = () => {
    setLoading(true);
    const formData = new FormData();
    formData.set(POINT.TYPE, POINT.UPDATE_POINT);
    formData.set(POINT.CUSTOMER_ID, selectedCustomer?.id.toString() ?? "");
    formData.set(
      POINT.TOTAL_POINTS,
      selectedCustomer?.totalPoints.toString() ?? "0",
    );
    formData.set(POINT.REASON, value);
    fetcher.submit(formData, { method: "POST", action: "/app/customer" });
  };
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const { EC, EM } = fetcher.data as any;
      if (EC == 0) {
        shopify.toast.show(EM);
        setOpenModalUpdate(false);
      } else {
        shopify.toast.show(EM, {
          isError: true,
        });
      }
      setLoading(false);
    }
  }, [fetcher]);
  return (
    <>
      <Modal
        id="update-point-customer"
        onHide={() => setOpenModalUpdate(false)}
        open={modalOpenUpdate}
      >
        <Page>
          <BlockStack gap={"400"}>
            <TextField
              label="Total points"
              type="number"
              value={selectedCustomer?.totalPoints.toString()}
              onChange={(e) => {
                if (+e < 0) {
                  setErr("Total points must be greater than 0");
                  return;
                }
                setErr("");
                if (selectedCustomer)
                  setSelectedCustomer({ ...selectedCustomer, totalPoints: +e });
              }}
              autoComplete="off"
              error={err != "" ? err : ""}
            />
            <TextField
              label="Reason"
              value={value}
              onChange={handleChange}
              placeholder="Enter reason why you update the totalPoint of customer"
              multiline={4}
              autoComplete="off"
            />
            <InlineStack align="end">
              <Button
                variant="primary"
                onClick={handleSubmitUpdatePoint}
                loading={loading}
              >
                Submit
              </Button>
            </InlineStack>
          </BlockStack>
        </Page>

        <TitleBar title={`Update points for customer`}></TitleBar>
      </Modal>
    </>
  );
}

export default ModalUpdateCustomer;
