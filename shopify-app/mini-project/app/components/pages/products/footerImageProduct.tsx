import { Box, InlineStack } from "@shopify/polaris";
import { useProduct } from "app/hooks/useProduct";
import { IedgeMedia, Imedia } from "interfaces/product";
import _ from "lodash";

const FooterProductImage = ({
  images,
  goToSlide,
}: {
  images: IedgeMedia[];
  goToSlide: (index: number) => void;
}) => {
  const { selectedImage, setSelectedImage } = useProduct();
  const imageSetHandle = (image: IedgeMedia) => {
    setSelectedImage(image);
    const index = images.findIndex((item) => item.node.id === image.node.id);
    goToSlide(index);
  };

  const debouncedSearch = _.debounce(imageSetHandle, 500);
  const handleMouseImage = (image: IedgeMedia) => {
    debouncedSearch(image);
  };
  // const hanldeMouseLeave = () => {
  //   setSelectedImage(undefined);
  // };
  return (
    <>
      <InlineStack align="center" gap={"200"}>
        {images.length > 0 &&
          images.map((image, index) => {
            const { node } = image;
            const isMapping = node.id == selectedImage?.node.id;
            const style = {} as React.CSSProperties;
            if (isMapping) {
              style.border = "2px solid blue";
            }
            return (
              <Box key={index}>
                <div
                  onMouseEnter={() => handleMouseImage(image)}
                  // onMouseLeave={hanldeMouseLeave}
                  style={{
                    padding: "5px",
                    border: "2px solid #c6c8d1",
                    maxWidth: "80px",
                    width: "80px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "0.2s all",
                    ...style,
                  }}
                >
                  <img
                    src={node.image.url}
                    alt={node.alt}
                    style={{
                      maxWidth: "70px",
                      height: "70px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </Box>
            );
          })}
      </InlineStack>
    </>
  );
};

export default FooterProductImage;
