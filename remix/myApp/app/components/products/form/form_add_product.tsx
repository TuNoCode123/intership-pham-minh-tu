import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { IProduct, productSchema } from "~/interfaces/product";
import useProduct from "~/hooks/useProduct";
import { toast } from "react-toastify";
import { ActionTypes } from "~/constants/enum";

const FormProduct = ({
  setActive,
}: //   onCloseDrawer,
//   setUpdate,

{
  setActive: (v: boolean) => void;
  //   onCloseDrawer: () => void;
}) => {
  const { type, AddOrUpdateProductFromType, selectedProduct } = useProduct();
  //   const { type, selectedProduct } = context;
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<IProduct>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: selectedProduct?.name,
      price: selectedProduct?.price,
      description: selectedProduct?.description,
      category: selectedProduct?.category,
      image: selectedProduct?.image,
      stock: selectedProduct?.stock,
    },
  });
  useEffect(() => {
    console.log("product", getValues());
  }, []);

  const onSubmit = async (data: IProduct) => {
    console.log("data", type);
    const res = await AddOrUpdateProductFromType(
      { ...data },
      type,
      selectedProduct?.id
    );
    if (res) {
      const { EC, EM } = res;
      if (EC == 0) {
        toast.success(EM);
        reset();
        setActive(false);
        return;
      } else {
        toast.error(EM);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 sm:p-8 bg-white   rounded-xl w-screen">
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

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image
          </label>
          <input
            type="text"
            id="image"
            {...register("image")}
            placeholder="Enter stock"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
          )}
        </div>
        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className=" cursor-pointer w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            {type == ActionTypes.ADD_ITEM ? "Add" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormProduct;
