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
import { CursorType, PointToVoucherType } from "app/validates/point";
import React from "react";
import { DeleteIcon } from "@shopify/polaris-icons";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { usePoint } from "app/hooks/usePoint";
import { POINT } from "app/constrant/enum";
import { formatVND } from "app/helpers/formatMoney";
function PointTableRedeem({
  data,
  cursor,
}: {
  data: PointToVoucherType[];
  cursor: CursorType | null;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setSpendPoint, setTitle, setModalOpenSpend } = usePoint();
  const rows =
    data && data.length > 0
      ? data.map((item) => {
          return [
            item.moneyAmount,
            formatVND(item.pointNumber),
            item.created_at,
            <Button
              onClick={() => {
                setSpendPoint({
                  moneyAmount: item.moneyAmount,
                  pointNumber: item.pointNumber,
                  id: item.id,
                });

                setTitle(POINT.DELETE);
                setModalOpenSpend(true);
              }}
            >
              Delete
            </Button>,
            <Button
              variant="primary"
              onClick={() => {
                setSpendPoint({
                  moneyAmount: item.moneyAmount,
                  pointNumber: item.pointNumber,
                  id: item.id,
                });
                setTitle(POINT.UPDATE);
                setModalOpenSpend(true);
              }}
            >
              Update
            </Button>,
          ];
        })
      : [];
  const heading =
    data.length > 0
      ? Object.keys(
          data.map((item) => {
            const { moneyAmount, pointNumber, created_at } = item;
            return {
              MoneyAmount: moneyAmount,
              PointNumber: pointNumber,
              CreatedAt: created_at,
              Delete: "delete",
              Update: "update",
            };
          })[0],
        )
      : [];
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
          headings={heading}
          rows={rows}
          pagination={{
            hasNext: cursor?.isNextPage,
            hasPrevious: cursor?.isPreviousPage,
            onPrevious: () => {
              const params = new URLSearchParams(searchParams);
              params.delete("typeCursorSpend", "after");
              params.set("typeCursorSpend", "before");
              params.set("id_spend", (cursor?.previousId ?? 0).toString());
              navigate(`?${params.toString()}`, { preventScrollReset: true });
            },
            onNext: () => {
              const params = new URLSearchParams(searchParams);
              params.delete("typeCursorSpend", "before");
              params.set("typeCursorSpend", "after");
              params.set("id_spend", (cursor?.nextId ?? 0).toString());
              navigate(`?${params.toString()}`, { preventScrollReset: true });
            },
          }}
        />
      </LegacyCard>
    </Page>
  );
}

export default PointTableRedeem;
