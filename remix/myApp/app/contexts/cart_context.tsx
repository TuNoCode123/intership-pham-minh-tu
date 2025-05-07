import { c } from "node_modules/vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";
import React, {
  createContext,
  useContext,
  ReactNode,
  useReducer,
  useEffect,
  useState,
  useMemo,
} from "react";
import { ActionTypes } from "~/constants/enum";
import { ICart } from "~/interfaces/product";

// Định nghĩa loại dữ liệu bạn muốn chia sẻ qua context
interface CartContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  totalPrice: number;
}

// Khởi tạo context với giá trị mặc định
export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

// Provider component để bao bọc các component con và cung cấp dữ liệu

// Định nghĩa các action types
type Action =
  | { type: ActionTypes.ADD_ITEM; payload: ICart }
  | { type: ActionTypes.REMOVE_ITEM; payload: number }
  | { type: ActionTypes.UPDATE_ITEM; payload: ICart }
  | { type: ActionTypes.LOADING_DATA; payload: ICart[] }
  | { type: ActionTypes.DELETE_MUNTIPLE_ITEM; payload: number[] };

// Định nghĩa state
interface State {
  cart: ICart[];
}

// Reducer function
export const cartReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.ADD_ITEM:
      const cloneArr = JSON.parse(JSON.stringify(state.cart)) as ICart[];
      const index = cloneArr.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        cloneArr[index].quantity += action.payload.quantity;
        return {
          ...state,
          cart: cloneArr,
        };
      }
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case ActionTypes.LOADING_DATA:
      return {
        ...state,
        cart: [...action.payload],
      };
    case ActionTypes.UPDATE_ITEM:
      const cloneArr2 = JSON.parse(JSON.stringify(state.cart)) as ICart[];
      const index2 = cloneArr2.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index2 >= 0) {
        const { quantity, price } = action.payload;
        cloneArr2[index2].quantity = quantity;
        cloneArr2[index2].totalPrice = quantity * price;
        return {
          ...state,
          cart: cloneArr2,
        };
      }
      return {
        ...state,
        cart: [...state.cart],
      };
    case ActionTypes.REMOVE_ITEM:
      const cloneArr1 = JSON.parse(JSON.stringify(state.cart)) as ICart[];
      const newArr = cloneArr1.filter((item) => item.id !== action.payload);
      return {
        ...state,
        cart: [...newArr],
      };
    case ActionTypes.DELETE_MUNTIPLE_ITEM:
      const cloneArrCart = JSON.parse(JSON.stringify(state.cart)) as ICart[];
      const newArr1 = cloneArrCart.filter((item) => {
        const isExistedItems = action.payload.some((id) => id === item.id);
        return !isExistedItems;
      });
      return {
        ...state,
        cart: [...newArr1],
      };
    default:
      return state;
  }
};
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { cart: [] });
  const [first, setFirst] = useState(false);
  const totalPrice = useMemo(
    () =>
      state.cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [state.cart]
  );
  useEffect(() => {
    if (first) localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);
  useEffect(() => {
    const listCart = localStorage.getItem("cart");
    if (listCart) {
      dispatch({
        type: ActionTypes.LOADING_DATA,
        payload: JSON.parse(listCart),
      });
    }
    setFirst(true);
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
