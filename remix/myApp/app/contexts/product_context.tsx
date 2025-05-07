import React, {
  createContext,
  useContext,
  ReactNode,
  useReducer,
  useState,
} from "react";
import { ActionTypes } from "~/constants/enum";
import { IProduct } from "~/interfaces/product";

// Định nghĩa loại dữ liệu bạn muốn chia sẻ qua context
interface ProductContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  type: ActionTypes.ADD_ITEM | ActionTypes.UPDATE_ITEM;
  setType: (type: ActionTypes.ADD_ITEM | ActionTypes.UPDATE_ITEM) => void;
  selectedProduct: IProduct | null;
  setSelectedProduct: (product: IProduct | null) => void;
}

// Khởi tạo context với giá trị mặc định
export const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

// Provider component để bao bọc các component con và cung cấp dữ liệu

// Định nghĩa các action types
type Action =
  | { type: ActionTypes.ADD_ITEM; payload: IProduct }
  | { type: ActionTypes.REMOVE_ITEM; payload: number }
  | { type: ActionTypes.UPDATE_ITEM; payload: IProduct }
  | { type: ActionTypes.LOADING_DATA; payload: IProduct[] };

// Định nghĩa state
interface State {
  products: IProduct[];
}

// Reducer function
export const productReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.LOADING_DATA:
      return {
        ...state,
        products: [...action.payload],
      };
    case ActionTypes.ADD_ITEM:
      return {
        ...state,
        products: [action.payload, ...state.products],
      };
    case ActionTypes.UPDATE_ITEM:
      const updatedProducts = state.products.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
      return {
        ...state,
        products: updatedProducts,
      };
    case ActionTypes.REMOVE_ITEM:
      const filteredProducts = state.products.filter(
        (product) => product.id !== action.payload
      );
      return {
        ...state,
        products: filteredProducts,
      };
    default:
      return state;
  }
};
export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(productReducer, { products: [] });
  const [type, setType] = useState<
    ActionTypes.ADD_ITEM | ActionTypes.UPDATE_ITEM
  >(ActionTypes.ADD_ITEM);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  return (
    <ProductContext.Provider
      value={{
        state,
        dispatch,
        type,
        setType,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
