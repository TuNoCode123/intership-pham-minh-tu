import { ProductContext } from "app/contexts/productContext";
import { IlistSelect } from "app/routes/app.product.$id";
import { IselectOption } from "interfaces/product";
import { useContext } from "react";

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a Product Provider");
  }
  return context;
};
