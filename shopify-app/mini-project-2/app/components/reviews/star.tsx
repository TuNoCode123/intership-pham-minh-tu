import { Icon, InlineStack } from "@shopify/polaris";
import { StarFilledIcon } from "@shopify/polaris-icons";
const Star = ({ numberStarts }: { numberStarts: number }) => {
  return (
    <div style={{ width: "100px" }}>
      <InlineStack gap={"0"}>
        {Array.from({ length: numberStarts }, (_, i) => i).map(() => {
          return <Icon source={StarFilledIcon} tone="base" />;
        })}
      </InlineStack>
    </div>
  );
};

export default Star;
