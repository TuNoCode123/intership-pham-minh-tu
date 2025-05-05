import { useContext } from "react";
import CartContext from "../contexts/cartContext";

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
export default useCart;
