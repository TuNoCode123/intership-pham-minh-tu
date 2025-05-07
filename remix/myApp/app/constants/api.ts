import { update } from "lodash";

const baseUrl = import.meta.env.VITE_API_URL;
export const api = {
  getAllProduct: `${baseUrl}/products`,
  addProduct: `${baseUrl}/admin/products`,
  updateProduct: (id: number) => `${baseUrl}/admin/products/${id}`,
  removeProduct: (id: number) => `${baseUrl}/admin/products/${id}`,
};
