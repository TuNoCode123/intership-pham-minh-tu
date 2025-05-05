// src/contexts/CartContext.tsx
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { ICart } from "../day17/interface";

interface CartContextType {
  // cart: ICart[];
  // setCart: (v: ICart[]) => void;
  // addItemIntoCart: (v: ICart) => void;
  totalPrice: number;
  // removeItemFromCart: (id: number) => void;
  state: State;
  dispatch: React.Dispatch<Action>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type State = { cart: ICart[] };

export enum ActionTypes {
  ADD_ITEMS = "ADD_ITEMS",
  REMOVE_ITEM = "REMOVE_ITEM",
  TOTAL_PRICE = "TOTAL_PRICE",
}
type Action =
  | { type: ActionTypes.ADD_ITEMS; payload: ICart }
  | { type: ActionTypes.REMOVE_ITEM; payload: number };
// | { type: ActionTypes.TOTAL_PRICE };

// const initialState: State = { cart: [] };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionTypes.ADD_ITEMS:
      const cloneDeep = JSON.parse(JSON.stringify(state.cart)) as ICart[];
      const findItems = cloneDeep.find((item) => item.id == action.payload.id);
      if (findItems) {
        const findIndex = cloneDeep.findIndex(
          (item) => item.id == action.payload.id
        );
        if (findIndex >= 0) {
          findItems.quantity += action.payload.quantity;
          cloneDeep[findIndex] = findItems;
        }
      } else {
        cloneDeep.push(action.payload);
      }
      return {
        ...state,
        cart: cloneDeep,
      };
    case ActionTypes.REMOVE_ITEM:
      const { cart } = state;
      const deepClone = JSON.parse(JSON.stringify(cart)) as ICart[];
      const removeImplement = deepClone.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        cart: removeImplement,
      };
    // setCart(removeImplement);
    // case "reset":
    //   return initialState;
    default:
      return state;
  }
}

export const CartProviderDay17 = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, { cart: [] });
  const totalPrice = useMemo(
    () => state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.cart]
  );
  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartContext;
