import { z } from "zod";

const productSchema = z.object({
  id: z.number().int().positive().optional(), // id tự tăng, optional khi create
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be at most 255 characters"),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().int().min(0, "Stock must be >= 0").default(0),
  description: z.string().optional(), // TEXT nên optional
  category: z
    .string()
    .max(255, "Category must be at most 255 characters")
    .optional(),
});

const correctProductSchema = z.object({
  id: z
    .number()
    .int()
    .positive()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: "id must be a positive number",
    }),

  name: z.string().max(255, "Name must be at most 255 characters").optional(),

  price: z.number().positive("Price must be a positive number").optional(),

  stock: z.number().int().min(0, "Stock must be >= 0").optional(),

  description: z.string().optional(),

  category: z
    .string()
    .max(255, "Category must be at most 255 characters")
    .optional(),
});
export { productSchema, correctProductSchema };
