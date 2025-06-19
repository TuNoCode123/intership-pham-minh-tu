import {
  Badge,
  BlockStack,
  Box,
  InlineStack,
  Select,
  Tag,
  Text,
} from "@shopify/polaris";
import VariantProduct from "./variant";
import { InodeMediaVariant, IproductDetail } from "interfaces/product";
import { useEffect } from "react";
import { useProduct } from "app/hooks/useProduct";

interface IinforProductProps {
  product: IproductDetail;
  pickedVariant: InodeMediaVariant | undefined;
  selectOptions: Record<string, string[]>;
}
const InforProduct = ({
  product,
  pickedVariant,
  selectOptions,
}: IinforProductProps) => {
  const { options, selected, handleSelectChange } = useProduct();
  useEffect(() => {
    if (options.length > 0) {
      handleSelectChange(options[0].value);
    }
  }, [options]);
  return (
    <>
      <BlockStack gap="200">
        <Box>
          <span
            style={{
              color: "rgb(18 18 18 / 75%)",
              textTransform: "uppercase",
            }}
          >
            {product.vendor}
          </span>
        </Box>
        <Box>
          <Text variant="bodyLg" as="h1">
            <span
              style={{
                fontSize: "26px",

                display: "inline-block", // cần thiết nếu bạn muốn đặt width
                maxWidth: "530px",
                lineHeight: "30px",
              }}
            >
              {product.title}
            </span>
          </Text>
        </Box>
        <Box as="div">
          <Select
            label="Location"
            options={options}
            onChange={handleSelectChange}
            value={selected}
          />
        </Box>
        <Box as="div">
          <InlineStack wrap={false} gap={"400"}>
            <Text as="span" textDecorationLine="line-through">
              {pickedVariant?.node.compareAtPrice || 1}{" "}
              {pickedVariant?.currencyCode}
            </Text>
            <Text as="span">
              {pickedVariant?.node.price || 1} {pickedVariant?.currencyCode}
            </Text>
            <Badge tone="attention">Sale</Badge>
          </InlineStack>
        </Box>
        <Box>
          <VariantProduct variants={selectOptions} />
        </Box>
        <Box>
          <Text variant="bodySm" as="p">
            Quantity : ( {pickedVariant?.node.currentInventoryQuantity} )
          </Text>
        </Box>
      </BlockStack>
    </>
  );
};

export default InforProduct;
