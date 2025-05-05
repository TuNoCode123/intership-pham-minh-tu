// src/contexts/CartContext.tsx
import { createContext, useContext, useMemo, useState } from "react";
import type { ICart } from "../day16/interface";

interface CartContextType {
  cart: ICart[];
  setCart: (v: ICart[]) => void;
  addItemIntoCart: (v: ICart) => void;
  totalPrice: number;
  removeItemFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<ICart[]>([]);
  const addItemIntoCart = (v: ICart) => {
    const cloneDeep = JSON.parse(JSON.stringify(cart)) as ICart[];
    const findItems = cloneDeep.find((item) => item.id == v.id);
    if (findItems) {
      const findIndex = cloneDeep.findIndex((item) => item.id == v.id);
      if (findIndex >= 0) {
        findItems.quantity += v.quantity;
        cloneDeep[findIndex] = findItems;
        setCart(cloneDeep);
      }
    } else {
      setCart([...cart, v]);
    }
  };
  const removeItemFromCart = (id: number) => {
    const deepClone = JSON.parse(JSON.stringify(cart)) as ICart[];
    const removeImplement = deepClone.filter((item) => item.id !== id);
    setCart(removeImplement);
  };
  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  return (
    <CartContext.Provider
      value={{ cart, setCart, addItemIntoCart, totalPrice, removeItemFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartContext;
