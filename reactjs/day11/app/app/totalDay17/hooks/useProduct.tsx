import { useContext } from "react";
import ProductContext from "../contexts/productContext";

const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProduct must be used within an ProductProvider");
  return context;
};
export default useProduct;
