import { z } from "zod";
export const productSchema = z.object({
  id: z.coerce.number().min(1, "ID must be a positive number").optional(),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Must be a valid URL").optional(),
  name: z.string(),
  stock: z.coerce.number().min(1, "stock have to larger than 1"),
});
export interface ICart {
  id: number;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

// Nếu cần type TypeScript:
export type IProduct = z.infer<typeof productSchema>;
