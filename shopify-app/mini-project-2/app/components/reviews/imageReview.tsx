import { Card } from "@shopify/polaris";
import { IimageReview } from "app/interfaces/reviews";

const ImageReview = ({ images }: { images: IimageReview }) => {
  return (
    <>
      <Card>
        <img
          src={images.image}
          style={{ maxWidth: "100px", objectFit: "cover" }}
        />
      </Card>
    </>
  );
};

export default ImageReview;
