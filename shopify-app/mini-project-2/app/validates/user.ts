import { z } from "zod/v4";

export const customerSchema = z.object({
  id: z.number().optional(),
  customerId: z
    .string()
    .refine((val) => val.startsWith("gid://shopify/Customer/"), {
      message: "customerId start ís not valid'",
    }),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  total_point: z.number().optional(),
});
export type customerType = z.infer<typeof customerSchema>;

export const orderPointSchema = z.object({
  amount: z.int().gte(0, "amount must greater or equal than 0"),
  customerId: z
    .string()
    .refine((val) => val.startsWith("gid://shopify/Customer/"), {
      message: "customerId start ís not valid'",
    }),
});
