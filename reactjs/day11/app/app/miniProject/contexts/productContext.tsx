import React, { createContext, useEffect, useReducer, useState } from "react";
import type { IProduct } from "../interface";

interface CartContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  total: number;
  loading: boolean;
  current: number;
  setCurrent: (v: number) => void;
  limit: number;
  type: "add" | "update";
  setType: (v: "add" | "update") => void;
  selectedProduct: IProduct | undefined;
  setSelectedProduct: (v: IProduct | undefined) => void;
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
  REMOVE_MUNTIPLE_ITEM = "REMOVE_MUNTIPLE_ITEM",
}

type Action =
  | { type: ActionTypes.ADD_ITEMS; payload: IProduct }
  | { type: ActionTypes.REMOVE_ITEM; payload: number } // assume payload is product id
  | { type: ActionTypes.UPDATE_ITEM; payload: IProduct }
  | { type: ActionTypes.LOADING_ITEM; payload: IProduct[] };

function reducerProduct(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.LOADING_ITEM:
      if (action.payload.length === 0) return { ...state, product: [] };
      return {
        ...state,
        product: [...action.payload],
      };
    case ActionTypes.ADD_ITEMS:
      return {
        ...state,
        product: [action.payload, ...state.product],
      };
    case ActionTypes.UPDATE_ITEM:
      const cloneArr = JSON.parse(JSON.stringify(state.product)) as IProduct[];
      const index = cloneArr.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        cloneArr[index] = action.payload;
      }
      return {
        ...state,
        product: [...cloneArr],
      };

    case ActionTypes.REMOVE_ITEM:
      const cloneArr1 = JSON.parse(JSON.stringify(state.product)) as IProduct[];
      const newArr = cloneArr1.filter((item) => item.id !== action.payload);
      return {
        ...state,
        product: [...newArr],
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
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [limit, setLimit] = useState(4);
  const [total, setTotal] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [type, setType] = useState<"add" | "update">("add");
  const getListProduct = async (limit: number, page: number) => {
    try {
      setIsLoading(true);
      // const url=https://fakestoreapi.com/products
      const url = `http://localhost:8000/api/v1/products?limit=${limit}&page=${page}`;
      const body = {
        method: "GET", // hoặc 'POST', 'PUT', tùy API
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await fetch(url, body);
      if (!res.ok) throw new Error("error api");
      const data = await res.json();
      if (data) {
        const { DT } = data;
        const { total, data: listProduct } = DT;
        setTotal(total);
        dispatch({ type: ActionTypes.LOADING_ITEM, payload: listProduct });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getListProduct(limit, current);
  }, [limit, current]);
  return (
    <ProductMiniProjectContext.Provider
      value={{
        state,
        dispatch,
        total,
        loading,
        current,
        setCurrent,
        limit,
        type,
        setType,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </ProductMiniProjectContext.Provider>
  );
};

export default ProductMiniProjectContext;
