import React, { useState } from "react";
import type { IProduct } from "../interface";
import * as pkg from "react-lazy-load-image-component";
const { LazyLoadImage } = pkg;
// import ReactStars from "react-stars";
import { formatNumber } from "../helpers/formatMoney";

const Product = ({
  product,
}: // onclickAddToCart,
{
  product: IProduct;
  // onclickAddToCart: (product: IProduct, quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState(0);
  const buttonClick = () => {
    // onclickAddToCart(product, quantity);
    setQuantity(0);
  };
  return (
    <div
      className="container border-2  p-5 cursor-pointer shadow-2xl rounded-4xl "
      style={{ height: "500px" }}
    >
      <div style={{ height: "250px" }}>
        <div className="flex justify-center items-center select-none">
          <img
            alt={"image not found"}
            height={160}
            src={product?.image} // use normal <img> attributes as props
            width={160}
          />
          {/* <LazyLoadImage
            alt={"image not found"}
            height={160}
            src={product?.image} // use normal <img> attributes as props
            width={160}
          /> */}
        </div>
      </div>
      <div>
        <div className="w-ful truncate  mt-5 text-xl font-semibold">
          {product?.title}
        </div>
        <div>
          {/* <ReactStars
            count={5}
            value={product.rating}
            size={24}
            color2={"#ffd700"}
          /> */}
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-red-500 text-4xl font-semibold mt-3  ">
            {formatNumber(product?.price)} $
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
