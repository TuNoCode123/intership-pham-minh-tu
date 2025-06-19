import { useFetcher } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  BlockStack,
  Box,
  Button,
  InlineStack,
  Page,
  TextField,
} from "@shopify/polaris";
import { POINT } from "app/constrant/enum";
import { usePoint } from "app/hooks/usePoint";
import { Ires } from "app/interfaces/res";
import { useEffect, useState } from "react";

function FormSpend() {
  const shopify = useAppBridge();
  const fetcher = useFetcher();
  const { spendPoint, setSpendPoint, title, setModalOpenSpend } = usePoint();
  const [err, setErr] = useState({
    moneyAmount: "",
    pointNumber: "",
  });
  const handleSubmitAddPoint = () => {
    setLoading(true);
    const formData = new FormData();
    if (title === POINT.ADD) {
      formData.set(
        POINT.SPEND_POINT_DATA,
        JSON.stringify({ ...spendPoint, type: "L2" }),
      );
      formData.set(POINT.TYPE_ACTIONS, POINT.ADD);
    } else if (title === POINT.UPDATE) {
      formData.set(
        POINT.SPEND_POINT_DATA,
        JSON.stringify({ ...spendPoint, type: "L2" }),
      );
      formData.set(POINT.TYPE_ACTIONS, POINT.UPDATE);
    }

    formData.set(POINT.TYPE, POINT.SPEND_POINT);
    fetcher.submit(formData, { method: "POST" });
  };
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const data = fetcher.data as Ires<any>;
      if (data && data?.EC == 0) {
        setSpendPoint({ moneyAmount: 0, pointNumber: 0 });
        shopify.toast.show(data?.EM);
        setLoading(false);
        setModalOpenSpend(false);
      } else {
        shopify.toast.show(data?.EM, {
          isError: true,
        });
        setLoading(false);
      }
    }
  }, [fetcher]);

  return (
    <Page>
      <BlockStack gap={"300"}>
        <BlockStack>
          <TextField
            label="MoneyAmount"
            type="number"
            value={spendPoint.moneyAmount.toString()}
            onChange={(e) => {
              if (+e < 0) {
                setErr({
                  ...err,
                  moneyAmount: "MoneyAmount must be greater than 0",
                });
                return;
              }
              setErr({ ...err, moneyAmount: "" });
              setSpendPoint({ ...spendPoint, moneyAmount: +e });
            }}
            autoComplete="off"
            error={err.moneyAmount != "" ? err.moneyAmount : ""}
          />
          <TextField
            label="pointNumber"
            type="number"
            value={spendPoint.pointNumber.toString()}
            onChange={(e) => {
              if (+e < 0) {
                setErr({
                  ...err,
                  pointNumber: "Condition must be greater than 0",
                });
                return;
              }
              setErr({ ...err, pointNumber: "" });
              setSpendPoint({ ...spendPoint, pointNumber: +e });
            }}
            autoComplete="off"
            error={err.pointNumber != "" ? err.pointNumber : ""}
          />
        </BlockStack>
        <InlineStack align="end">
          <Button
            variant="primary"
            onClick={handleSubmitAddPoint}
            loading={loading}
          >
            Submit
          </Button>
        </InlineStack>
      </BlockStack>
    </Page>
  );
}
export default FormSpend;
