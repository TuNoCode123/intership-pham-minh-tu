import React, { useState } from "react";
import type { IProduct } from "./interface";
import * as pkg from "react-lazy-load-image-component";
const { LazyLoadImage } = pkg;
// import ReactStars from "react-stars";
import { formatNumber } from "./helpers/formatMoney";

const Product = ({
  product,
  onclickAddToCart,
}: {
  product: IProduct;
  onclickAddToCart: (product: IProduct, quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState(0);
  const buttonClick = () => {
    onclickAddToCart(product, quantity);
    setQuantity(0);
  };
  return (
    <div
      className="container border-2  p-5 cursor-pointer rounded-4xl "
      style={{ height: "500px" }}
    >
      <div style={{ height: "250px" }}>
        <div className="flex justify-center items-center select-none">
          <LazyLoadImage
            alt={"image not found"}
            height={160}
            src={product.image} // use normal <img> attributes as props
            width={160}
          />
        </div>
      </div>
      <div>
        <div className="w-ful truncate  mt-5 text-xl font-semibold">
          {product.title}
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
            {formatNumber(product.price)} $
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center items-center mt-5">
        <input
          value={quantity}
          onChange={(e) => setQuantity(+e.target.value)}
          type="number"
          id="numberInput"
          name="numberInput"
          min="1"
          max="100"
          placeholder="ENTER QUANTITY"
          step="1"
          className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
        />
        <button
          onClick={buttonClick}
          type="button"
          className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 cursor-pointer dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default Product;
