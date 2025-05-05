import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { IProduct } from "../day16/interface";
import { formatNumber } from "../day16/helpers/formatMoney";
import { Rating } from "@smastrom/react-rating";

import "@smastrom/react-rating/style.css";
import { useContextCart } from "../hooks/useContextCart";
import { set } from "zod";
const DetailProduct = () => {
  const { cart, addItemIntoCart } = useContextCart();
  useEffect(() => {
    console.log(cart);
  }, [cart]);
  const params = useParams();
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState<IProduct>();
  const nav = useNavigate();
  const clickToHome = () => nav("/day16");
  const getProductDetail = async (id: number) => {
    const { id: IdParams } = params;

    const url = `https://fakestoreapi.com/products/${IdParams}`;
    const body = {
      method: "GET", // hoặc 'POST', 'PUT', tùy API
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await fetch(url, body);
    if (!res.ok) throw new Error("error api");
    const data = await res.json();
    console.log(data);
    if (data) setProduct(data);
  };
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(+e.target.value);
  };
  const handleAddToCart = () => {
    if (product && quantity > 0) addItemIntoCart({ ...product, quantity });
    setQuantity(0);
  };
  useEffect(() => {
    getProductDetail(+params);
  }, []);

  return (
    <>
      <div>
        <span
          onClick={clickToHome}
          className=" text-5xl text-blue-500 underline cursor-pointer block m-5"
        >
          Back
        </span>
        {product && (
          <div className="w-2xl mt-7 p-5 mx-auto bg-white rounded-2xl shadow-2xl flex justify-center border-2 flex-col items-center">
            <div>
              <img
                src={product?.image}
                alt={product?.title}
                width={250}
                height={250}
              />
            </div>
            <div>
              <div className="mt-3">
                <span className=" text-base underline">
                  Category: {product?.category}
                </span>
              </div>
              <div className="mt-3">
                <span className=" text-2xl font-semibold">
                  {product?.title}
                </span>
              </div>
              <div className="mt-2">
                <span className=" text-3xl text-blue-400">
                  ${product.price && formatNumber(product.price)}
                </span>
              </div>
              <div className="mt-3">
                <em>{product?.description}</em>
              </div>
              <div className=" flex justify-between items-center mt-3">
                <div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      className="w-16 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddToCart}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div>
                  <div className="mt-3 flex justify-end">
                    <Rating
                      style={{ maxWidth: 250 }}
                      value={product.rating.rate}
                      readOnly={true}
                      // onChange={setRating}
                    />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <span>{product.rating.count} reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DetailProduct;
