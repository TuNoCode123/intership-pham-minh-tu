import { ALL_CODES } from "app/constrant/enum";
import { REASON } from "app/constrant/record";
import { z } from "zod/v4";
export const ExchangeSchema = z.object({
  id: z.int().optional(),
  pointAmount: z.int().gt(0, "Point number must greater than 0"),
  moneyAmount: z.int().gt(0, "Money Amount must greater than 0"),
  type: z.enum([ALL_CODES.EARN, ALL_CODES.SPEND]),
  created_at: z.date().optional(),
  condition: z.int().gt(0, "Condition Amount must greater than 0"),
});
export type ExchangeType = z.infer<typeof ExchangeSchema>;

export const MoneyToPointSchema = z.object({
  id: z.int().optional(),
  moneyAmount: z.int().gt(0, "Money Amount must greater than 0"),
  created_at: z.any().optional(),
  condition: z.int().gt(0, "Condition Amount must greater than 0"),
});
export type MoneyToPointType = z.infer<typeof MoneyToPointSchema>;
export const PointToVoucherSchema = z.object({
  id: z.int().optional(),
  created_at: z.any().optional(),
  pointNumber: z.int().gt(0, "Point number must greater than 0"),
  moneyAmount: z.int().gt(0, "Money Amount must greater than 0"),
});
export type PointToVoucherType = z.infer<typeof PointToVoucherSchema>;

export const PointLogSchema = z.object({
  type: z.enum([ALL_CODES.EARN, ALL_CODES.SPEND]),
  amount: z.number().int().gte(0, "amount must greate than 0"),
  customerId: z.number().int().gte(0, "customerId must greate than 0"),
  resonType: z.enum([...Object.keys(REASON)]),
});

export type PointLog = z.infer<typeof PointLogSchema>;
export type CursorType = {
  isNextPage: boolean;
  nextId: number;
  previousId: number;
  isPreviousPage: boolean;
};
