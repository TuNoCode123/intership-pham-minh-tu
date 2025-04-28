import { useEffect, useMemo, useState } from "react";
import type { ICart } from "../interface";

const useCart = () => {
  const [cart, setCart] = useState<ICart[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const addToCart = (product: ICart) => {
    if (cart.length > 0) {
      const findItemsIndex = cart.findIndex((item) => item.id === product.id);

      if (findItemsIndex >= 0) {
        const findItems = cart.find((item) => item.id === product.id);
        const cloneDeep = JSON.parse(JSON.stringify(cart));
        if (findItems) {
          findItems.quantity += product.quantity;
          cloneDeep[findItemsIndex] = findItems;
          setCart(cloneDeep);
          return;
        }
      }
    }
    setCart((prevCart) => [...prevCart, product]);
  };
  const deleteOneItemFromCart = (id: number) => {
    const cloneCart = JSON.parse(JSON.stringify(cart)) as ICart[];
    const findItemIndex = cloneCart.findIndex((item: ICart) => item.id === id);
    cloneCart.splice(findItemIndex, 1);
    setCart(cloneCart);
  };
  const deleteSelectedItem = (selectItems: { id: number }[]) => {
    const cloneCart = JSON.parse(JSON.stringify(cart)) as ICart[];
    const getValidItem = cloneCart.filter(
      (item: ICart) => !selectItems.some((i) => i.id === item.id)
    );
    setCart(getValidItem);
    // const findItemIndex = cloneCart.findIndex((item: ICart) => item.id === id);
  };
  const totalPrice = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );
  useEffect(() => {
    const itemLocal = localStorage.getItem("cart");
    if (itemLocal) {
      const getCart = JSON.parse(itemLocal);
      setCart(getCart);
      setIsOpen(true);
    }
  }, []);
  useEffect(() => {
    if (cart.length > 0 && isOpen)
      localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return {
    addToCart,
    cart,
    setCart,
    totalPrice,
    deleteOneItemFromCart,
    deleteSelectedItem,
  }; // hoặc return dữ liệu gì đó
};

export default useCart;
