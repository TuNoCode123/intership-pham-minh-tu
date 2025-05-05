import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type IProduct } from "../interface";
import useProduct from "~/totalDay17/hooks/useProduct";
import { ActionTypes } from "~/totalDay17/contexts/productContext";
import { actions } from "../home";
import { useEffect } from "react";

const FormProduct = ({
  product,
  typeAction,
  //   setUpdate,
  closeModal,
}: {
  product: IProduct;
  //   setUpdate: () => void;
  closeModal: () => void;
  typeAction: string;
}) => {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<IProduct>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      stock: product.stock,
    },
  });
  useEffect(() => {
    console.log("product", getValues());
  }, []);
  const { dispatch } = useProduct();
  const onSubmit = async (data: IProduct) => {
    console.log("---------------->", data);
    let url = "";
    if (typeAction === actions.ADD) {
      url = "http://localhost:8000/api/v1/admin/products";
    } else {
      url = `http://localhost:8000/api/v1/admin/products/${product.id}`;
    }

    // const url = "https://fakestoreapi.com/products";

    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4xIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpZCI6MiwiaWF0IjoxNzQ2NDI0OTMxLCJleHAiOjE3NDY0NjA5MzF9.VJX8iYDcZnnRkWew3ViOGsmW8dqgtppr8_kIRGo5jiw`;
    const body = {
      method: typeAction === actions.ADD ? "POST" : "PUT",
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
      if (typeAction === actions.ADD) {
        dispatch({ type: ActionTypes.ADD_ITEMS, payload: DT });
      } else {
        dispatch({
          type: ActionTypes.UPDATE_ITEM,
          payload: { ...getValues(), id: product.id },
        });
      }
      closeModal();
      reset();
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 sm:p-8 bg-white   rounded-xl w-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Product
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            placeholder="Enter product name"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            type="number"
            step="0.01"
            id="price"
            {...register("price")}
            placeholder="Enter product price"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            placeholder="Enter product description"
            rows={4}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            {...register("category")}
            placeholder="Enter product category"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700"
          >
            Stock
          </label>
          <input
            type="text"
            id="stock"
            {...register("stock")}
            placeholder="Enter stock"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className=" cursor-pointer w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            {typeAction === actions.ADD ? "Add" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormProduct;
