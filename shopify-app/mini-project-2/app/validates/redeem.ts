import { z } from "zod/v4";

export const CodeSchema = z.object({
  id_code: z.number().int().gt(0, "id must greater than 0").optional(),
  code: z.string().optional(),
  isUsed: z.boolean().default(false),
  customerId: z.number().int(),
  created_at: z.string().datetime().optional(),
});
const positiveInt = (field: string) =>
  z.number().int().gt(0, `${field} must be greater than 0`);
export const RedeemedSchema = z.object({
  id_redeem: positiveInt("id").optional(),
  codeId: positiveInt("codeId").optional(),
  amount: positiveInt("amount").optional(),
  customerId: z.number().int(),
  point_used: positiveInt("point_used").optional(),
  exchangeId: positiveInt("exchangeId"),
  created_at: z.string().datetime().optional(),
});

type Code = z.infer<typeof CodeSchema>;
type Redeemed = z.infer<typeof RedeemedSchema>;
export const CombinedCodeRedeemedSchema = z.intersection(
  CodeSchema,
  RedeemedSchema,
);

// TypeScript type
type CodeRedeemed = z.infer<typeof CombinedCodeRedeemedSchema>;

export type { Code, Redeemed, CodeRedeemed };
