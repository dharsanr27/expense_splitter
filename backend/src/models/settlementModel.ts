

import { db } from "../db/index.js";
import { expenses, settlements } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

export async function createSettlement(
  groupId: number,
  fromUserId: string,
  toUserId: string,
  amount: number
): Promise<any> {
  try {
    // 1. Find the expense
    const expenseResult = await db
      .select({
        id: expenses.id,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.groupId, groupId),
          eq(expenses.paidBy, toUserId)
        )
      );

    if (expenseResult.length === 0) {
      throw new Error(
        `No pending expenses found for group ${groupId} paid by user ${toUserId}`
      );
    }

    const expenseId = expenseResult[0].id;

  

    // 2. Insert settlement inside a transaction
    const settlement = await db.transaction(async (tx) => {
      const [result] = await tx
        .insert(settlements)
        .values({
          groupId,
          fromUserId,
          toUserId,
          amount: amount.toString(),
        })
        .returning();

      return result;
    });

    return settlement;
  } catch (error) {
    console.error("Error in createSettlements models:", error);
    throw error;
  }
}