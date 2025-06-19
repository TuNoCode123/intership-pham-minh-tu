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

function FormEarn() {
  const shopify = useAppBridge();
  const fetcher = useFetcher();
  const {
    earnPoint,
    setEarnPoint,
    setModalOpenEarn,
    title,
    rankingCustomer,
    setRakingCustomer,
    err,
    setErr,
  } = usePoint();
  // const [err, setErr] = useState({
  //   tierName: "",
  //   pointRate: "",
  //   min_spent: "",
  // });
  const handleSubmitAddPoint = () => {
    setLoading(true);
    const formData = new FormData();
    if (title === POINT.ADD) {
      formData.set(
        POINT.EARN_POINT_DATA,
        JSON.stringify({ ...rankingCustomer, type: "L1" }),
      );

      formData.set(POINT.TYPE_ACTIONS, POINT.ADD);
    } else if (title === POINT.UPDATE) {
      formData.set(
        POINT.EARN_POINT_DATA,
        JSON.stringify({ ...rankingCustomer, type: "L1" }),
      );
      formData.set(POINT.TYPE_ACTIONS, POINT.UPDATE);
    }

    formData.set(POINT.TYPE, POINT.EARN_POINT);
    fetcher.submit(formData, { method: "POST" });
  };
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const data = fetcher.data as Ires<any>;
      if (data && data?.EC == 0) {
        setEarnPoint({ moneyAmount: 0, condition: 0 });
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
      {rankingCustomer && (
        <Page>
          <BlockStack gap={"300"}>
            <BlockStack gap={"200"}>
              <TextField
                label="TierName"
                type="text"
                value={rankingCustomer?.tierName.toString()}
                onChange={(e) => {
                  if (e == "") {
                    setErr({
                      ...err,
                      tierName: "TierName must be not empty",
                    });
                    setRakingCustomer({ ...rankingCustomer, tierName: e });
                    return;
                  }
                  setRakingCustomer({ ...rankingCustomer, tierName: e });
                  setErr({ ...err, tierName: "" });
                  // setEarnPoint({ ...earnPoint, moneyAmount: +e });
                }}
                autoComplete="off"
                error={err.tierName != "" ? err.tierName : ""}
              />
              <TextField
                label="Min_Spent"
                type="number"
                value={rankingCustomer.min_spent.toString()}
                onChange={(e) => {
                  if (+e < 0) {
                    setErr({
                      ...err,
                      min_spent: "Min_spent must be greater than 0",
                    });
                    return;
                  }
                  setErr({ ...err, min_spent: "" });
                  setRakingCustomer({ ...rankingCustomer, min_spent: +e });
                  // setEarnPoint({ ...earnPoint, min_spent: +e });
                }}
                autoComplete="off"
                error={err.min_spent != "" ? err.min_spent : ""}
              />
              <TextField
                label="Point_Rate"
                type="number"
                value={rankingCustomer.pointRate.toString()}
                onChange={(e) => {
                  if (+e < 0) {
                    setErr({
                      ...err,
                      pointRate: "PointRate must be greater than 0",
                    });
                    return;
                  }
                  setErr({ ...err, pointRate: "" });
                  // setEarnPoint({ ...earnPoint, condition: +e });
                  setRakingCustomer({ ...rankingCustomer, pointRate: +e });
                }}
                autoComplete="off"
                error={err.pointRate != "" ? err.pointRate : ""}
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
      )}
    </>
  );
}
export default FormEarn;
