import {
  Badge,
  BlockStack,
  Box,
  Divider,
  Icon,
  InlineStack,
  Text,
} from "@shopify/polaris";

export interface Ibadge {
  tone: any;
  icon: {
    source: any;
    tone: any;
  };
}

interface IcardDashBoardProps {
  title: string;
  badgeTitle: Ibadge;
  quantity: number;
  description: string;
  totalVariant?: string;
}
const CardDashBoard = ({
  title,
  badgeTitle,
  quantity,
  totalVariant,
  description,
}: IcardDashBoardProps) => {
  return (
    <>
      <Box as="div">
        <BlockStack gap={"150"}>
          <BlockStack gap={"200"}>
            <Box width="100%">
              <InlineStack align="space-between" blockAlign="baseline">
                <Text as="h1" variant="headingXl">
                  {title}
                </Text>
                <Badge tone={badgeTitle.tone}>
                  <Icon
                    source={badgeTitle.icon.source}
                    tone={badgeTitle.icon.tone}
                  />
                </Badge>
              </InlineStack>
            </Box>
            <Box>
              <InlineStack align="space-between" blockAlign="baseline">
                <Text as="h1" variant="heading3xl">
                  {quantity}
                </Text>
              </InlineStack>
            </Box>
            <Box>
              <Text as="p" variant="headingSm">
                {description}
              </Text>
            </Box>
            {totalVariant && (
              <Box>
                <Text as="p" variant="headingSm">
                  {totalVariant}
                </Text>
              </Box>
            )}
          </BlockStack>
          <Divider />
          <Box>
            <InlineStack align="space-between" blockAlign="baseline">
              <Text as="span">Cập nhật lần cuối</Text>
              <Text as="span">2 phút trước</Text>
            </InlineStack>
          </Box>
        </BlockStack>
      </Box>
    </>
  );
};

export default CardDashBoard;
