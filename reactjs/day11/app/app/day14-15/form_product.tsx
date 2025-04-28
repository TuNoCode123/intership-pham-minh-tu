import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type IProduct } from "./interface";

const FormProduct = ({
  product,
  setProduct,
  closeModal,
}: {
  product: IProduct[];
  setProduct: (product: IProduct[]) => void;
  closeModal: () => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProduct>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: IProduct) => {
    const url = "https://fakestoreapi.com/products";
    const body = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, body);
    if (!response.ok) throw new Error("error api");
    const newProduct = await response.json();
    setProduct([...product, newProduct]);
    closeModal();
    reset();
  };

  return (
    <div className="max-w-lg mx-auto p-6 sm:p-8 bg-white   rounded-xl w-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add New Product
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ID */}
        <div>
          <label
            htmlFor="id"
            className="block text-sm font-medium text-gray-700"
          >
            ID
          </label>
          <input
            type="number"
            id="id"
            {...register("id")}
            placeholder="Enter product ID"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          {errors.id && (
            <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title")}
            placeholder="Enter product title"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL
          </label>
          <input
            type="text"
            id="image"
            {...register("image")}
            placeholder="Enter image URL"
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
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormProduct;
