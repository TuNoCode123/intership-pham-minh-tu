import { useContext } from "react";
import ProductMiniProjectContext from "../contexts/productContext";

const useProduct = () => {
  const context = useContext(ProductMiniProjectContext);
  if (!context)
    throw new Error("useProduct must be used within an ProductProvider");
  return context;
};
export default useProduct;
