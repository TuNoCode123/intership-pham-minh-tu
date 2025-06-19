import { PointContext } from "app/contexts/pointContext";
import { useContext } from "react";

export const usePoint = () => {
  const context = useContext(PointContext);
  if (!context) {
    throw new Error("useProduct must be used within a Product Provider");
  }
  return context;
};
