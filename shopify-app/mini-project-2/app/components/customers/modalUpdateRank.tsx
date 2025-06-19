import { useFetcher } from "@remix-run/react";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import {
  BlockStack,
  Button,
  InlineStack,
  Page,
  Select,
  TextField,
} from "@shopify/polaris";
import { POINT } from "app/constrant/enum";
import { usePoint } from "app/hooks/usePoint";
import { CustomerRanking } from "app/interfaces/point";
import { useCallback, useEffect, useState } from "react";

export function ModalUpdateRank({
  options,
}: {
  options: {
    label: string;
    value: string;
  }[];
}) {
  const shopify = useAppBridge();
  const {
    selectedCustomer,
    setSelectedCustomer,
    openModalUpdateRank,
    setOpenModalUpdateRank,
  } = usePoint();
  //   const [value, setValue] = useState("UPDATE EXTRA POINT FOR EVENT");
  const fetcher = useFetcher();
  const [selected, setSelected] = useState(
    selectedCustomer?.rankId ? selectedCustomer?.rankId.toString() : "1",
  );
  useEffect(() => {
    setSelected(
      selectedCustomer?.rankId ? selectedCustomer?.rankId.toString() : "1",
    );
  }, [selectedCustomer?.rankId]);
  //   const handleChange = useCallback(
  //     (newValue: string) => setValue(newValue),
  //     [],
  //   );
  const [loading, setLoading] = useState(false);
  //   const [err, setErr] = useState("");
  const handleSubmitUpdatePoint = () => {
    setLoading(true);
    const formData = new FormData();
    formData.set(POINT.TYPE, POINT.UPDATE_RANK);
    formData.set(POINT.CUSTOMER_ID, selectedCustomer?.id.toString() ?? "");
    formData.set(POINT.RANKID, selected);
    // formData.set(POINT.MONEY, selected);
    fetcher.submit(formData, { method: "POST", action: "/app/customer" });
  };
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const { EC, EM } = fetcher.data as any;
      if (EC == 0) {
        shopify.toast.show(EM);
        setOpenModalUpdateRank(false);
      } else {
        shopify.toast.show(EM, {
          isError: true,
        });
      }
      setLoading(false);
    }
  }, [fetcher]);

  const handleSelectChange = useCallback(
    (value: string) => setSelected(value),
    [],
  );

  return (
    <>
      <Modal
        id="update-point-customer"
        onHide={() => setOpenModalUpdateRank(false)}
        open={openModalUpdateRank}
      >
        <Page>
          <BlockStack gap={"400"}>
            <Select
              label="Ranks"
              options={options}
              onChange={handleSelectChange}
              value={selected}
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

        <TitleBar title={`Update Rank for customer`}></TitleBar>
      </Modal>
    </>
  );
}

export default ModalUpdateRank;
