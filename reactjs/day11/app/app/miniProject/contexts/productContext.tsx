import React, { createContext, useReducer } from "react";
import type { IProduct } from "../interface";

interface CartContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const ProductMiniProjectContext = createContext<
  CartContextType | undefined
>(undefined);

type State = { product: IProduct[] };

export enum ActionTypes {
  ADD_ITEMS = "ADD_ITEMS",
  REMOVE_ITEM = "REMOVE_ITEM",

  UPDATE_ITEM = "UPDATE_ITEM",
  LOADING_ITEM = "LOADING_ITEM",
}

type Action =
  | { type: ActionTypes.ADD_ITEMS; payload: IProduct }
  | { type: ActionTypes.REMOVE_ITEM; payload: number } // assume payload is product id
  | { type: ActionTypes.UPDATE_ITEM; payload: IProduct }
  | { type: ActionTypes.LOADING_ITEM; payload: IProduct[] };

function reducerProduct(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.LOADING_ITEM:
      return {
        ...state,
        product: [...action.payload],
      };
    default:
      return state;
  }
}

export const ProductMiniProjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducerProduct, { product: [] });

  return (
    <ProductMiniProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductMiniProjectContext.Provider>
  );
};

export default ProductMiniProjectContext;
