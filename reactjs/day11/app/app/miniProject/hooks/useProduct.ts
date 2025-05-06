import { useContext, useEffect, useState } from "react";
import ProductMiniProjectContext, {
  ActionTypes,
} from "../contexts/productContext";
import type { IProduct } from "../interface";
import { message } from "antd";

const useProduct = () => {
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4xIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpZCI6MiwiaWF0IjoxNzQ2NTAyMzIxLCJleHAiOjE3NDY1MzgzMjF9.oFwMPxUCKDAmu9R8nQrOl8ldsKGTPVInhvPZOgE68qk`;
  const context = useContext(ProductMiniProjectContext);
  if (!context)
    throw new Error("useProduct must be used within an ProductProvider");
  const { dispatch } = context;
  const callApiProduct = async (data: IProduct, type: string) => {
    try {
      let url;

      if (type === "add") {
        url = "http://localhost:8000/api/v1/admin/products";
      } else {
        url = `http://localhost:8000/api/v1/admin/products/${data.id}`;
      }
      console.log(url);
      const body = {
        method: type === "add" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(url, body);
      if (!response.ok) throw new Error("error api");
      const newProduct = await response.json();
      const { DT, EC } = newProduct;
      if (EC == 0) {
        if (type === "add") {
          dispatch({ type: ActionTypes.ADD_ITEMS, payload: DT });
        } else if (type === "update") {
          dispatch({ type: ActionTypes.UPDATE_ITEM, payload: data });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const removeproduct = async (id: number) => {
    try {
      const url = `http://localhost:8000/api/v1/admin/products/${id}`;
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
    context,
    callApiProduct,
    removeproduct,
  };
};
export default useProduct;
