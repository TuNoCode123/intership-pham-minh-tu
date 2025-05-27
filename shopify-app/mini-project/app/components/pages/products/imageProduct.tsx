import { BlockStack, Box } from "@shopify/polaris";
import { InodeMediaVariant, IproductDetail } from "interfaces/product";
import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";

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
  return (
    <>
      <Box maxWidth="100%">
        <BlockStack>
          <div style={{ width: "100%", maxWidth: "500px", height: "450px" }}>
            {/* <Slider {...settings}> */}
            <Slide
              slidesToScroll={1}
              slidesToShow={1}
              indicators={true}
              autoplay={false}
              transitionDuration={500}
              arrows={true}
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
              {pickedVariant && pickedVariant?.node?.media?.edges?.length > 0
                ? pickedVariant?.node?.media?.edges.map((item, index) => {
                    return (
                      <>
                        <Box
                          as="div"
                          key={index}
                          width="100%"
                          minHeight="400px"
                        >
                          <SlideItem
                            src={item?.node?.image?.url}
                            alt={item?.node?.alt || "Product Image"}
                          />
                        </Box>
                      </>
                    );
                  })
                : product?.media?.edges.map((item, index) => {
                    console.log(index);
                    return (
                      <Box as="div" key={index} width="100%" minHeight="400px">
                        <SlideItem
                          src={item?.node?.image?.url}
                          alt={item?.node?.alt || "Product Image"}
                        />
                      </Box>
                    );
                  })}
              {/* </Slider> */}
            </Slide>
          </div>
        </BlockStack>
      </Box>
    </>
  );
};

export default ImagesProduct;
