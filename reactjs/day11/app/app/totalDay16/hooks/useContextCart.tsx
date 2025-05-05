import { useContext } from "react";
import CartContext from "../contexts/cartContext";

export const useContextCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
