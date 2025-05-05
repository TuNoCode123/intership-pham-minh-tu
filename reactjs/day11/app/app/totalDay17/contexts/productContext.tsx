// src/contexts/ProductContext.tsx
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { ICart, IProduct } from "../day17/interface";

interface CartContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const ProductContext = createContext<CartContextType | undefined>(undefined);

type State = { product: IProduct[] };

export enum ActionTypes {
  ADD_ITEMS = "ADD_ITEMS",
  REMOVE_ITEM = "REMOVE_ITEM",
  TOTAL_PRICE = "TOTAL_PRICE",
  ADD_MUNTIPLE_ITEM = "ADD_MUNTIPLE_ITEM",
  UPDATE_ITEM = "UPDATE_ITEM",
}
type Action =
  | { type: ActionTypes.ADD_ITEMS; payload: IProduct }
  | { type: ActionTypes.REMOVE_ITEM; payload: number }
  | { type: ActionTypes.ADD_MUNTIPLE_ITEM; payload: IProduct[] }
  | { type: ActionTypes.UPDATE_ITEM; payload: IProduct };
// | { type: ActionTypes.TOTAL_PRICE };

// const initialState: State = { cart: [] };

function reducerProduct(state: State, action: Action) {
  switch (action.type) {
    case ActionTypes.ADD_MUNTIPLE_ITEM:
      return {
        ...state,
        product: [...state.product, ...action.payload],
      };
    case ActionTypes.ADD_ITEMS:
      return {
        ...state,
        product: [action.payload, ...state.product],
      };
    case ActionTypes.UPDATE_ITEM:
      const cloneDeep = JSON.parse(JSON.stringify(state.product)) as IProduct[];
      const findItems = cloneDeep.findIndex(
        (item) => item.id === action.payload.id
      );
      if (findItems >= 0) {
        cloneDeep[findItems] = action.payload;
      }
      return {
        ...state,
        product: cloneDeep,
      };
    case ActionTypes.REMOVE_ITEM:
      return {
        ...state,
        product: state.product.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
}

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducerProduct, { product: [] });

  return (
    <ProductContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
export default ProductContext;
