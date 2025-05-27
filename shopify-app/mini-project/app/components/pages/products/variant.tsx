import { BlockStack, Box, InlineStack } from "@shopify/polaris";
import { useProduct } from "app/hooks/useProduct";
import { useEffect } from "react";

interface IvariantsProductProps {
  variants: Record<string, string[]>;
}

const ColorVariant = ({
  variant,
  variants,
  keyVariant,
}: {
  variant: string;
  variants: Record<string, string>;
  keyVariant: string;
}) => {
  const customStyle =
    variants[keyVariant] && variants[keyVariant] === variant
      ? {
          border: "2px solid rgb(18 18 18 / 50%)",
        }
      : {
          border: "none",
        };
  return (
    <>
      <div style={{ ...customStyle, padding: "2px", borderRadius: "50%" }}>
        <div
          style={{
            width: "35px",
            height: "35px",
            backgroundColor: variant,
            borderRadius: "50%",
            cursor: "pointer",
            padding: "2px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        />
      </div>
    </>
  );
};

const CommonVariant = ({
  variant,
  variants,
  keyVariant,
}: {
  variant: string;
  variants: Record<string, string>;
  keyVariant: string;
}) => {
  const customStyle =
    variants[keyVariant] && variants[keyVariant] === variant
      ? {
          background: "rgb(18,18,18)",
          color: "white",
        }
      : {};
  return (
    <>
      <Box as="div" borderRadius="200" borderColor="border-warning">
        <div
          style={{
            width: "50px",
            padding: "5px 10px",
            border: "1px solid black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            borderRadius: "30px",
            ...customStyle,
          }}
        >
          {variant}
        </div>
      </Box>
    </>
  );
};

const ItemVariant = ({
  variantType,
  listVariant,
  listVariants,
}: {
  variantType: string;
  listVariant: string[];
  listVariants: Record<string, string>;
}) => {
  const { onclickChangeVariant, listVariants: listVariantsContext } =
    useProduct();
  return (
    <>
      <BlockStack gap={"100"}>
        <Box>
          {variantType} : {listVariantsContext[variantType]}
        </Box>
        <InlineStack wrap={false} gap={"100"}>
          {listVariant.map((variant, index) => {
            return (
              <div
                key={index}
                onClick={() => onclickChangeVariant(variantType, variant)}
              >
                {variantType == "Color" ? (
                  <>
                    <ColorVariant
                      variant={variant}
                      variants={listVariants}
                      keyVariant={variantType}
                    />
                  </>
                ) : (
                  <CommonVariant
                    variant={variant}
                    variants={listVariants}
                    keyVariant={variantType}
                  />
                )}
              </div>
            );
          })}
        </InlineStack>
      </BlockStack>
    </>
  );
};
const VariantProduct = ({ variants }: IvariantsProductProps) => {
  const keys = Object.keys(variants).sort((a, b) => a.localeCompare(b));

  const { listVariants } = useProduct();
  // useEffect(() => {
  //   console.log(variants);
  // }, [variants]);
  return (
    <div>
      <BlockStack gap="300">
        {keys.length > 0 &&
          keys.map((key, index) => {
            return (
              <Box key={index}>
                <ItemVariant
                  variantType={key}
                  listVariant={variants[key]}
                  listVariants={listVariants}
                />
              </Box>
            );
          })}
      </BlockStack>
    </div>
  );
};

export default VariantProduct;
