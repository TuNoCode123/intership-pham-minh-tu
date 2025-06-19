import {
  Page,
  LegacyCard,
  DataTable,
  InlineStack,
  Icon,
  ButtonGroup,
  Button,
  Box,
  Text,
} from "@shopify/polaris";
import { CursorType, MoneyToPointType } from "app/validates/point";
import React from "react";
import { DeleteIcon } from "@shopify/polaris-icons";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { usePoint } from "app/hooks/usePoint";
import { POINT } from "app/constrant/enum";
import { CustomerRanking } from "app/interfaces/point";
import { formatVND } from "app/helpers/formatMoney";
function PointTable({
  data,
  cursor,
}: {
  data: CustomerRanking[];
  cursor: CursorType | null;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    setEarnPoint,
    setModalOpenEarn,
    setTitle,
    rankingCustomer,
    setRakingCustomer,
    setErr,
  } = usePoint();
  // const handleUpdatePointEarn=(item)
  const rows =
    data && data.length > 0
      ? data.map((item) => {
          return [
            item.tierName,
            item.pointRate,
            formatVND(item.min_spent),
            item.created_at,
            <>
              {item.id != 1 && (
                <Button
                  onClick={() => {
                    setRakingCustomer({
                      tierName: item.tierName,
                      pointRate: item.pointRate,
                      min_spent: item.min_spent,
                      id: item.id,
                    });

                    setTitle(POINT.DELETE);
                    setModalOpenEarn(true);
                  }}
                >
                  Delete
                </Button>
              )}
            </>,

            <Button
              variant="primary"
              onClick={() => {
                setErr({
                  tierName: "",
                  pointRate: "",
                  min_spent: "",
                });

                setRakingCustomer({
                  tierName: item.tierName,
                  pointRate: item.pointRate,
                  min_spent: item.min_spent,
                  id: item.id,
                });
                setTitle(POINT.UPDATE);
                setModalOpenEarn(true);
              }}
              // onClick={() => {
              //   setEarnPoint({
              //     moneyAmount: item.moneyAmount,
              //     condition: item.condition,
              //     id: item.id,
              //   });
              //   setTitle(POINT.UPDATE);
              //   setModalOpenEarn(true);
              // }}
            >
              Update
            </Button>,
          ];
        })
      : [];
  const heading = [
    "tierName",
    "pointRate",
    "min_spent",
    "createAt",
    "Delete",
    "Update",
  ];
  const navigate = useNavigate();
  return (
    <Page>
      <LegacyCard>
        <DataTable
          columnContentTypes={[
            "text",
            "numeric",
            "numeric",
            "numeric",
            "numeric",
            "numeric",
          ]}
          headings={[...heading]}
          rows={rows}
          pagination={{
            hasNext: cursor?.isNextPage,
            hasPrevious: cursor?.isPreviousPage,
            onPrevious: () => {
              const params = new URLSearchParams(searchParams);
              params.delete("typeCursorEarn", "after");
              params.set("typeCursorEarn", "before");
              params.set("id_earn", (cursor?.previousId ?? 0).toString());
              navigate(`?${params.toString()}`, { preventScrollReset: true });
            },
            onNext: () => {
              const params = new URLSearchParams(searchParams);
              params.delete("typeCursorEarn", "before");
              params.set("typeCursorEarn", "after");
              params.set("id_earn", (cursor?.nextId ?? 0).toString());
              navigate(`?${params.toString()}`, { preventScrollReset: true });
            },
          }}
        />
      </LegacyCard>
    </Page>
  );
}

export default PointTable;
