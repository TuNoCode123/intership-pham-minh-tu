import { useContext } from "react";
import { CartMiniProjectContext } from "../contexts/cartContext";

import { ActionTypes } from "../contexts/productContext";
import type { ICart } from "../interface";

const useCart = () => {
  const context = useContext(CartMiniProjectContext);

  if (!context)
    throw new Error("useCart must be used within an ProductProvider");
  const { state, dispatch, totalPrice } = context;
  const addToCart = (
    product: {
      name: string;
      price: number;
      id: number;
    },
    quantity: number
  ) => {
    dispatch({
      type: ActionTypes.ADD_ITEMS,
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        totalPrice: product.price * quantity,
      },
    });
  };
  const removeMuntipleItems = (arr: number[]) => {
    dispatch({
      type: ActionTypes.REMOVE_MUNTIPLE_ITEM,
      payload: arr,
    });
  };
  const updateItem = (arr: ICart[]) =>
    dispatch({ type: ActionTypes.UPDATE_ITEM, payload: arr });
  return {
    cart: state.cart,
    totalPrice,
    addToCart,
    removeMuntipleItems,
    updateItem,
  };
};
export default useCart;
