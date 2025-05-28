import { BlockStack, Box, Button } from "@shopify/polaris";
import { InodeMediaVariant, IproductDetail } from "interfaces/product";
import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";
import FooterProductImage from "./footerImageProduct";
import { useEffect, useRef, useState } from "react";
import { useProduct } from "app/hooks/useProduct";

const SlideItem = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          borderRadius: "10px",
        }}
        alt={alt}
      />
    </div>
  );
};
const ImagesProduct = ({
  product,
  pickedVariant,
}: {
  product: IproductDetail;
  pickedVariant?: InodeMediaVariant;
}) => {
  const {
    handleSetSelectedImage,
    selectedImage,
    currentSlide,
    setCurrentSlide,
  } = useProduct();
  const slideRef = useRef(null);
  // const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index: number): void => {
    const current = slideRef.current as any;
    if (current) {
      current.goTo(index); // Chuyển đến slide theo index
      setCurrentSlide(index); // Cập nhật trạng thái slide hiện tại
    }
  };
  useEffect(() => {
    if (currentSlide > listImage.length - 1) {
      handleSetSelectedImage(listImage[0]);
      return;
    }
    handleSetSelectedImage(listImage[currentSlide]);
  }, [currentSlide]);
  const listImage =
    pickedVariant && pickedVariant?.node?.media?.edges?.length > 0
      ? pickedVariant?.node?.media?.edges
      : product?.media?.edges;
  useEffect(() => {
    if (!selectedImage) handleSetSelectedImage(listImage[0]);
  }, [listImage]);
  return (
    <>
      <Box maxWidth="100%">
        <BlockStack>
          <div style={{ width: "100%", maxWidth: "500px", height: "450px" }}>
            <Slide
              ref={slideRef}
              slidesToScroll={1}
              slidesToShow={1}
              indicators={true}
              autoplay={false}
              transitionDuration={500}
              arrows={true}
              onChange={(_oldIndex: number, newIndex: number) => {
                setCurrentSlide(newIndex);
              }}
              responsive={[
                {
                  breakpoint: 800,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  },
                },
                {
                  breakpoint: 500,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  },
                },
              ]}
            >
              {listImage.map((item, index) => {
                return (
                  <>
                    <Box as="div" key={index} width="100%" minHeight="400px">
                      <SlideItem
                        src={item?.node?.image?.url}
                        alt={item?.node?.alt || "Product Image"}
                      />
                    </Box>
                  </>
                );
              })}
            </Slide>
          </div>

          <FooterProductImage images={listImage} goToSlide={goToSlide} />
        </BlockStack>
      </Box>
    </>
  );
};

export default ImagesProduct;
