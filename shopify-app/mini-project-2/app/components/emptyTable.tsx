import { LegacyCard, EmptyState } from "@shopify/polaris";
import React from "react";

function EmptyTable() {
  return (
    <LegacyCard sectioned>
      <EmptyState
        heading="Not Found Data"
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        <p>Inspect your text and try again</p>
      </EmptyState>
    </LegacyCard>
  );
}
export default EmptyTable;
