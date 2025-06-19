import { ReviewContext } from "app/contexts/reviewContext";
import { useContext } from "react";

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview must be used within a Product Provider");
  }
  return context;
};
