import { z } from "zod/v4";

// Schema khi tạo mới Review (Create)
export const createReviewSchema = z.object({
  product_id: z.string(),
  shopId: z.string().optional(),
  customer_id: z
    .string()
    .refine((val) => val.startsWith("gid://shopify/Customer/"), {
      message: "customerId start ís not valid'",
    }),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(1),
  approved: z.boolean().optional(), // optional vì mặc định là false
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().optional(),
      }),
    )
    .optional(),
});
export type ReviewType = z.infer<typeof createReviewSchema>;
