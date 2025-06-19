import { Location_Api, REVIEW } from "app/constrant/enum";
import { Ireviews } from "app/interfaces/reviews";
import { ReviewType } from "app/validates/reviews";
import { createContext, ReactNode, useReducer, useState } from "react";
import { Socket } from "socket.io-client";

type ReviewContextType = {
  modalOpenApproved: boolean;
  setModalOpenApproved: (value: boolean) => void;
  closeModalApproved: () => void;
  openModalApproved: () => void;
  approved: string;
  setApproved: (value: any) => void;
  selectedReview: Ireviews | undefined;
  setSelectedReview: (value: Ireviews | undefined) => void;
  detailReview: Ireviews | undefined;
  setDetailReview: (value: Ireviews | undefined) => void;
  modalOpenDetailReview: boolean;
  openModalDetailReview: () => void;
  closeModalDetailReview: () => void;
  currentApi: string;
  setCurrentApi: (value: string) => void;
  modalOpenReviewDelete: boolean;
  openModalReviewDelete: () => void;
  closeModalReviewDelete: () => void;
};
export const ReviewContext = createContext<ReviewContextType | undefined>(
  undefined,
);

export const ReviewProvider = ({ children }: { children: ReactNode }) => {
  const [modalOpenApproved, setModalOpenApproved] = useState(false);
  const [modalOpenDetailReview, setModalDetailReview] = useState(false);
  const [modalOpenReviewDelete, setModalReviewDelete] = useState(false);
  const [approved, setApproved] = useState(REVIEW.APPROVED);
  const [selectedReview, setSelectedReview] = useState<Ireviews>();
  const [detailReview, setDetailReview] = useState<Ireviews>();
  const [currentApi, setCurrentApi] = useState<string>(
    Location_Api.CHANGE_REVIEW_STATE,
  );
  const [socket, setSocket] = useState<Socket>();
  const closeModalApproved = () => {
    setModalOpenApproved(false);
  };
  const openModalApproved = () => {
    setModalOpenApproved(true);
  };
  const openModalDetailReview = () => {
    setModalDetailReview(true);
  };
  const closeModalDetailReview = () => {
    setModalDetailReview(false);
  };
  const openModalReviewDelete = () => {
    setModalReviewDelete(true);
  };
  const closeModalReviewDelete = () => {
    setModalReviewDelete(false);
  };
  return (
    <ReviewContext.Provider
      value={{
        modalOpenApproved,
        setModalOpenApproved,
        closeModalApproved,
        openModalApproved,
        approved,
        setApproved,
        selectedReview,
        setSelectedReview,
        detailReview,
        setDetailReview,
        modalOpenDetailReview,
        openModalDetailReview,
        closeModalDetailReview,
        currentApi,
        setCurrentApi,
        modalOpenReviewDelete,
        openModalReviewDelete,
        closeModalReviewDelete,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
