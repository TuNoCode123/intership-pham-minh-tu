import React, {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { ICart, IProduct } from "../interface";
import { ActionTypes } from "./productContext";

interface CartContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  totalPrice: number;
}

export const CartMiniProjectContext = createContext<
  CartContextType | undefined
>(undefined);

type State = { cart: ICart[] };

type Action =
  | { type: ActionTypes.ADD_ITEMS; payload: ICart }
  | { type: ActionTypes.REMOVE_ITEM; payload: number } // assume payload is product id
  | { type: ActionTypes.UPDATE_ITEM; payload: ICart[] }
  | { type: ActionTypes.LOADING_ITEM; payload: ICart[] }
  | { type: ActionTypes.REMOVE_MUNTIPLE_ITEM; payload: number[] };

function reducerCart(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.LOADING_ITEM:
      return {
        ...state,
        cart: [...action.payload],
      };
    case ActionTypes.ADD_ITEMS:
      const { id, quantity } = action.payload;
      const cloneArrCart = JSON.parse(JSON.stringify(state.cart)) as ICart[];
      const existedItems = cloneArrCart.findIndex((item) => item.id === id);
      if (existedItems >= 0) {
        cloneArrCart[existedItems].quantity += quantity;
        return {
          ...state,
          cart: [...cloneArrCart],
        };
      }
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case ActionTypes.REMOVE_MUNTIPLE_ITEM:
      const cloneArr = JSON.parse(JSON.stringify(state.cart)) as ICart[];
      const newArr = cloneArr.filter((item) => {
        const isExistedItems = action.payload.some((id) => id === item.id);
        return !isExistedItems;
      });
      return {
        ...state,
        cart: [...newArr],
      };
    case ActionTypes.UPDATE_ITEM:
      return {
        ...state,
        cart: [...action.payload],
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
  const totalPrice = useMemo(
    () => cart.reduce((total, item) => total + item.totalPrice, 0),
    [cart]
  );
  useEffect(() => {
    if (firstTime) localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  return (
    <CartMiniProjectContext.Provider value={{ state, dispatch, totalPrice }}>
      {children}
    </CartMiniProjectContext.Provider>
  );
};

export default CartMiniProjectProvider;
