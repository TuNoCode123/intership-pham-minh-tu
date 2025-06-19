import { CursorType } from "app/validates/point";
import { customerType } from "app/validates/user";
import {
  Page,
  LegacyCard,
  DataTable,
  InlineStack,
  Box,
  BlockStack,
} from "@shopify/polaris";
import { useNavigate, useSearchParams } from "@remix-run/react";
import FilterCustomerForPoints from "./filter";
import { POINT } from "app/constrant/enum";
import SearchCustomer from "./search";
import EmptyTable from "../emptyTable";
const Table = ({
  rows,
  heading,
  cursor,
  type,
}: {
  rows: any;
  heading: any;
  cursor: CursorType;
  type?: string;
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const numberRecords =
    type == POINT.LOG ? POINT.NUMBER_LIMIT_LOGS : POINT.NUMBER_LIMIT;
  return (
    <>
      <BlockStack gap={"400"}>
        <LegacyCard>
          {rows.length == 0 ? (
            <EmptyTable />
          ) : (
            <DataTable
              columnContentTypes={[
                "text",
                "numeric",
                "numeric",
                "numeric",
                "numeric",
              ]}
              headings={heading}
              rows={rows}
              pagination={{
                hasNext: cursor.isNextPage,
                hasPrevious: cursor.isPreviousPage,
                onPrevious: () => {
                  const params = new URLSearchParams(searchParams);
                  const orderBy = params.get(POINT.ORDER_BY);
                  if (orderBy) {
                    const skip = params.get("skip") ?? 0;
                    if (!skip) {
                      params.set("skip", numberRecords.toString());
                    } else {
                      const newValue = +skip - +numberRecords;
                      params.set("skip", newValue.toString());
                    }
                  } else {
                    params.set("typeCursor", "before");
                    params.set("lastId", (cursor?.previousId ?? 0).toString());
                  }

                  navigate(`?${params.toString()}`, {
                    preventScrollReset: true,
                  });
                },
                onNext: () => {
                  const params = new URLSearchParams(searchParams);
                  const orderBy = params.get(POINT.ORDER_BY);
                  if (orderBy) {
                    const skip = params.get("skip") ?? 0;
                    if (!skip) {
                      params.set("skip", numberRecords.toString());
                    } else {
                      const newValue = +skip + +numberRecords;
                      params.set("skip", newValue.toString());
                    }
                  } else {
                    params.set("typeCursor", "after");
                    params.set("lastId", (cursor?.nextId ?? 0).toString());
                  }

                  navigate(`?${params.toString()}`, {
                    preventScrollReset: true,
                  });
                },
              }}
            />
          )}
        </LegacyCard>
      </BlockStack>
    </>
  );
};

export default Table;
