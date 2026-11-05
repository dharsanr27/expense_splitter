import { z } from "zod";

export const expenseSchema = z.object({
  params: z.object({
    groupId: z.coerce.number().int().positive(),
  }),
});
export const expenseSplitSchema = z.object({
  body: z.object({
   
    groupId: z.number().int().positive(),
    paidBy: z.string(),
    totalAmount: z.number().positive(),
    description: z.string().min(1).max(255),
  }),
});
export const UserBalanceSchema = z.object({
  params: z.object({
    groupId: z.coerce.number().int().positive(),
  }),
});


