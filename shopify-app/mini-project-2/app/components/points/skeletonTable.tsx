import {
  DataTable,
  LegacyCard,
  SkeletonBodyText,
  SkeletonPage,
  SkeletonTabs,
  SkeletonThumbnail,
} from "@shopify/polaris";

function SkeletonTable() {
  return (
    <SkeletonPage>
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
            "MoneyAmount",
            "Condition",
            "CreatedAt",
            "Delete",
            "Update",
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

export default SkeletonTable;
