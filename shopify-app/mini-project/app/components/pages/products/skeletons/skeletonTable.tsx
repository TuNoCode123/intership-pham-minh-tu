import {
  DataTable,
  LegacyCard,
  SkeletonBodyText,
  SkeletonPage,
  SkeletonTabs,
  SkeletonThumbnail,
} from "@shopify/polaris";
import React from "react";

function SkeletonProductTable() {
  return (
    <SkeletonPage primaryAction title="Sales by product">
      <LegacyCard>
        <DataTable
          columnContentTypes={[
            "text",
            "numeric",
            "numeric",
            "numeric",
            "numeric",
          ]}
          headings={[
            "Image",
            "Title",
            "Price Range",
            "Quantity",
            "Description",
          ]}
          rows={[
            [
              <SkeletonThumbnail size="small" />,
              <SkeletonBodyText lines={1} />,
              <SkeletonBodyText lines={1} />,
              <SkeletonBodyText lines={1} />,
              <SkeletonBodyText lines={1} />,
            ],
            [
              <SkeletonThumbnail size="small" />,
              <SkeletonBodyText lines={1} />,
              <SkeletonBodyText lines={1} />,
              <SkeletonBodyText lines={1} />,
              <SkeletonBodyText lines={1} />,
            ],
            [
              <SkeletonThumbnail size="small" />,
              <SkeletonBodyText lines={1} />,
              <SkeletonBodyText lines={1} />,
              <SkeletonBodyText lines={1} />,
              <SkeletonBodyText lines={1} />,
            ],
          ]}
        />
      </LegacyCard>
    </SkeletonPage>
  );
}

export default SkeletonProductTable;
