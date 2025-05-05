import React, { createContext, useEffect, useReducer, useState } from "react";
import type { ICart, IProduct } from "../interface";
import { ActionTypes } from "./productContext";

interface CartContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const CartMiniProjectContext = createContext<
  CartContextType | undefined
>(undefined);

type State = { cart: ICart[] };

type Action =
  | { type: ActionTypes.ADD_ITEMS; payload: ICart }
  | { type: ActionTypes.REMOVE_ITEM; payload: number } // assume payload is product id
  | { type: ActionTypes.UPDATE_ITEM; payload: ICart }
  | { type: ActionTypes.LOADING_ITEM; payload: ICart[] };

function reducerCart(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.LOADING_ITEM:
      return {
        ...state,
        cart: [...action.payload],
      };
    case ActionTypes.ADD_ITEMS:
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    default:
      return state;
  }
}

export const CartMiniProjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducerCart, { cart: [] });
  const { cart } = state;
  const [firstTime, setFirstTime] = useState(false);
  // []
  useEffect(() => {
    const isCart = localStorage.getItem("cart");
    if (isCart) {
      dispatch({ type: ActionTypes.LOADING_ITEM, payload: JSON.parse(isCart) });
    }
    setFirstTime(true);
  }, []);
  useEffect(() => {
    if (firstTime) localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  return (
    <CartMiniProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </CartMiniProjectContext.Provider>
  );
};

export default CartMiniProjectProvider;
