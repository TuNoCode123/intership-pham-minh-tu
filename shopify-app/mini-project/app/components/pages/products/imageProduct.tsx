import { BlockStack, Box, Button } from "@shopify/polaris";
import { InodeMediaVariant, IproductDetail } from "interfaces/product";
import FooterProductImage from "./footerImageProduct";
import { useEffect, useRef } from "react";
import { useProduct } from "app/hooks/useProduct";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "./style.css";
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
      {/* <InnerImageZoom
        src={src}
        zoomSrc={src}
        zoomType="hover"
        zoomPreload={true}
        className="custom-zoom-image"
      /> */}
      <img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
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
      current.slideTo(index); // Chuyển đến slide theo index
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
          <div style={{ width: "100%", maxWidth: "500px", height: "420px" }}>
            <Swiper
              ref={slideRef}
              modules={[Navigation]}
              navigation
              // spaceBetween={50}
              slidesPerView={1}
              onSlideChange={(swiper) => {
                slideRef.current = swiper as any;

                setCurrentSlide(swiper.realIndex);

                console.log("Current index:", swiper.realIndex);
              }}
              autoplay={true}
              // onSlideChange={() => console.log("slide change")}
              // onSwiper={(swiper) => console.log(swiper)}
              loop={true}
            >
              {listImage.map((item, index) => {
                return (
                  <>
                    <SwiperSlide>
                      <Box as="div" key={index} width="100%" minHeight="400px">
                        <SlideItem
                          src={item?.node?.image?.url}
                          alt={item?.node?.alt || "Product Image"}
                        />
                      </Box>
                    </SwiperSlide>
                  </>
                );
              })}
            </Swiper>
          </div>

          <FooterProductImage images={listImage} goToSlide={goToSlide} />
        </BlockStack>
      </Box>
    </>
  );
};

export default ImagesProduct;
