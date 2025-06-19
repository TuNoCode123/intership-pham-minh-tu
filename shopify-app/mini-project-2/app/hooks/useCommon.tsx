import { CommonText } from "app/contexts/commonContext";
import { useContext } from "react";

export const useCommon = () => {
  const context = useContext(CommonText);
  if (!context) {
    throw new Error("useCommon must be used within a Product Provider");
  }
  return context;
};
