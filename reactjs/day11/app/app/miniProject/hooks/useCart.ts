import { useContext } from "react";
import { CartMiniProjectContext } from "../contexts/cartContext";
import type { IProduct } from "../interface";
import { ActionTypes } from "../contexts/productContext";

const useCart = () => {
  const context = useContext(CartMiniProjectContext);

  if (!context)
    throw new Error("useCart must be used within an ProductProvider");
  const { state, dispatch } = context;
  const addToCart = (
    product: {
      name: string;
      price: number;
    },
    quantity: number
  ) => {
    dispatch({
      type: ActionTypes.ADD_ITEMS,
      payload: {
        name: product.name,
        price: product.price,
        quantity,
        totalPrice: product.price * quantity,
      },
    });
  };
  return {
    state,
    addToCart,
  };
};
export default useCart;
