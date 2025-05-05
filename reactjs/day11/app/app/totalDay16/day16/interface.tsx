import { z } from "zod";
export const productSchema = z.object({
  id: z.coerce.number().min(1, "ID must be a positive number"),
  title: z.string().min(1, "Title is required"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Must be a valid URL"),
  rating: z.object({
    rate: z.number(),
    count: z.number(),
  }),
});
export interface ICart {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

// Nếu cần type TypeScript:
export type IProduct = z.infer<typeof productSchema>;
