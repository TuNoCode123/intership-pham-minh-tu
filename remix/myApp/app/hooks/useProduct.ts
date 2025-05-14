import { useContext } from "react";
import { toast } from "react-toastify";
import { api } from "~/constants/api";
import { ActionTypes } from "~/constants/enum";
import { ProductContext } from "~/contexts/product_context";
import { IProduct } from "~/interfaces/product";

const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a PostProvider");
  }
  const {
    state,
    dispatch,
    type,
    setType,
    selectedProduct,
    setSelectedProduct,
  } = context;
  const { products } = state;
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4xIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpZCI6MiwiaWF0IjoxNzQ2NjcwOTEyLCJleHAiOjE3NDY3MDY5MTJ9.7te_vyAWLJ4TfuVLKVZA5AuGXlaE8fpnhnQWA4mCLkc`;
  const loadingDataToContext = (p: IProduct[]) =>
    dispatch({ type: ActionTypes.LOADING_DATA, payload: p });
  const AddOrUpdateProductFromType = async (
    data: IProduct,
    type: string,
    id: number | undefined
  ) => {
    // console.log("-----------------data", type);
    // if (!id) {
    //   return;
    // }
    try {
      let url;
      if (type === ActionTypes.ADD_ITEM) {
        console.log("add product", data);
        url = api.addProduct;
      } else {
        if (!id) return;
        url = api.updateProduct(id);
      }
      console.log(url);
      const body = {
        method: type === ActionTypes.ADD_ITEM ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(url, body);
      const newProduct = await response.json();
      const { DT, EC, EM } = newProduct;
      if (EC == 0) {
        if (type === ActionTypes.ADD_ITEM) {
          dispatch({ type: ActionTypes.ADD_ITEM, payload: DT });
        } else if (type === ActionTypes.UPDATE_ITEM) {
          dispatch({
            type: ActionTypes.UPDATE_ITEM,
            payload: { ...data, id },
          });
        }
      }
      return {
        EC,
        EM,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        return {
          EC: 1,
          EM: error.message,
        };
      return {
        EC: 1,
        EM: "something wrong",
      };
    }
  };

  const removeproduct = async (id: number) => {
    try {
      const url = api.removeProduct(id);
      const body = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(url, body);
      //   if (!response.ok) throw new Error(response.);
      const newProduct = await response.json();
      const { EC, EM } = newProduct;
      if (EC == 0) {
        dispatch({ type: ActionTypes.REMOVE_ITEM, payload: id });
      }
      return {
        EC,
        EM,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        return {
          EC: 1,
          EM: error.message,
        };
      return {
        EC: 1,
        EM: "something wrong",
      };
    }
  };

  return {
    products,
    loadingDataToContext,
    AddOrUpdateProductFromType,
    type,
    setType,
    selectedProduct,
    setSelectedProduct,
    removeproduct,
  };
};
export default useProduct;
