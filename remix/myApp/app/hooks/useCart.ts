import { useContext } from "react";
import { ActionTypes } from "~/constants/enum";
import { CartContext } from "~/contexts/cart_context";
import { ProductContext } from "~/contexts/product_context";
import { ICart } from "~/interfaces/product";

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a PostProvider");
  }
  const { state, dispatch, totalPrice } = context;
  const { cart } = state;
  const addToCart = (v: ICart) =>
    dispatch({ type: ActionTypes.ADD_ITEM, payload: v });
  const updateCart = (v: ICart) =>
    dispatch({ type: ActionTypes.UPDATE_ITEM, payload: v });
  const removeItem = (id: number) =>
    dispatch({ type: ActionTypes.REMOVE_ITEM, payload: id });
  const removeMuntipleItems = (arr: number[]) =>
    dispatch({ type: ActionTypes.DELETE_MUNTIPLE_ITEM, payload: arr });

  return {
    addToCart,
    cart,
    totalPrice,
    updateCart,
    removeItem,
    removeMuntipleItems,
  };
};
export default useCart;
