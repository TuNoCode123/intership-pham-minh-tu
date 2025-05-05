import { z } from "zod";
import "dotenv/config";
const limit = +process.env.LIMIT ?? 10;
const offset = +process.env.OFFSET ?? 0;
const productQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : offset))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Page must be a positive number",
    }),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, limit) : limit))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Limit must be a positive number",
    }),

  search: z.string().trim().optional().default(""),

  category: z.string().trim().optional().default(""),
});
const idSchema = z.object({
  id: z.number().refine((val) => !isNaN(val) && val > 0, {
    message: "Id must be a positive number",
  }),
});
const schemaUpdateState = z.object({
  id: z.number().refine((val) => !isNaN(val) && val > 0, {
    message: "Id must be a positive number",
  }),
  status: z.enum(["pending", "paid", "shipped", "cancelled"]),
});
export { productQuerySchema, idSchema, schemaUpdateState };
