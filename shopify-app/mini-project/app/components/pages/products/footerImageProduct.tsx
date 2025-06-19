import { Box, InlineStack } from "@shopify/polaris";
import { useProduct } from "app/hooks/useProduct";
import { IedgeMedia, Imedia } from "interfaces/product";
import { Swiper, SwiperSlide } from "swiper/react";

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
    <InlineStack align="center" gap={"200"}>
      <div style={{ width: "100%", maxWidth: "320px", height: "100px" }}>
        <Swiper
          // spaceBetween={50}
          slidesPerView={3}
          onSlideChange={(swiper) => {
            console.log("Current index:", swiper.realIndex);
          }}
          // onSlideChange={() => console.log("slide change")}
          // onSwiper={(swiper) => console.log(swiper)}
          loop={true}
        >
          {images.length > 0 &&
            images.map((image, index) => {
              const { node } = image;
              const isMapping = node.id == selectedImage?.node.id;
              const style = {} as React.CSSProperties;
              if (isMapping) {
                style.border = "2px solid blue";
              }
              return (
                <SwiperSlide key={index}>
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
                </SwiperSlide>
              );
            })}
          {/* <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
          <SwiperSlide>Slide 4</SwiperSlide>
          ... */}
        </Swiper>
        {/* <Slide
          // ref={slideRef}
          slidesToScroll={3}
          slidesToShow={3}
          transitionDuration={500}
          arrows={false}
          // onChange={(_oldIndex: number, newIndex: number) => {
          //   setCurrentSlide(newIndex);
          // }}
        >
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
        </Slide> */}
      </div>
    </InlineStack>
  );
};

export default FooterProductImage;
