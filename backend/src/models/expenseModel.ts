import pool from "../config/database.js";
import { db } from "../db/index.js";
import { eq,sql,desc } from "drizzle-orm";
import { profiles, expenses, groupMembers, splits } from "../db/schema.js";
//Task 2: don't forget to add a function to avoid duplicates in expense table
//1.create Expense with splits
//why we are using the pool.connect
  //what is transaction concept

export async function createExpenseWithSplits(
  groupId: number,
  paidBy: string,
  totalAmount: number,
  description: string,
): Promise<{
  expenseId: number;
  groupId: number;
  paidBy: string;
  totalAmount: number;
  splitAmount: number;
  totalMembers: number;
}> {
  try {
  

    // Convert rupees to integer paise.
    const totalPaise = Math.round(totalAmount * 100);

    if (totalPaise <= 0) {
      throw new Error("Expense amount must be at least ₹0.01");
    }

    const result = await db.transaction(async (tx) => {
      // Fetch group members.
      const members = await tx
        .select({
          userId: groupMembers.userId,
        })
        .from(groupMembers)
        .where(eq(groupMembers.groupId, groupId));

      const totalMembers = members.length;

      if (totalMembers === 0) {
        throw new Error(
          "Cannot create an expense for a group with no members",
        );
      }

      // Divide the expense into whole paise.
      const baseSharePaise = Math.floor(totalPaise / totalMembers);
      const remainderPaise = totalPaise % totalMembers;

      // Insert the expense.
      const [expense] = await tx
        .insert(expenses)
        .values({
          groupId,
          paidBy,
          amount: (totalPaise / 100).toFixed(2),
          description,
        })
        .returning({
          id: expenses.id,
        });

      // Prepare all member splits.
      const splitRecords = members.map((member, index) => {
        const memberSharePaise =
          baseSharePaise + (index < remainderPaise ? 1 : 0);

        return {
          expenseId: expense.id,
          userId: member.userId,
          amountOwed: (memberSharePaise / 100).toFixed(2),
        };
      });

      // Insert all splits in one database operation.
      await tx.insert(splits).values(splitRecords);

      return {
        expenseId: expense.id,
        groupId,
        paidBy,
        totalAmount: totalPaise / 100,
        splitAmount: baseSharePaise / 100,
        totalMembers,
      };
    });

    return result;
  } catch (error) {
    console.error("Failed to create expense with splits:", error);
    throw error;
  }
}

//2.Check user balance
type BalanceRow = {
  user_id: string;
  username: string | null;
  group_name: string | null;
  total_paid: string;
  total_owed: string;
  settlements_sent: string;
  settlements_received: string;
};
export async function getUserGroupBalance(
  groupId: number
): Promise<BalanceRow[]> { 
  try {
    const balanceResult = await db.execute<BalanceRow>(sql`
      WITH GroupPaid AS (
        SELECT
          paid_by AS user_id,
          SUM(amount) AS total_paid
        FROM expenses
        WHERE group_id = ${groupId}
        GROUP BY paid_by
      ),

      GroupOwed AS (
        SELECT
          s.user_id,
          SUM(s.amount_owed) AS total_owed
        FROM splits s
        JOIN expenses e
          ON s.expense_id = e.id
        WHERE e.group_id = ${groupId}
        GROUP BY s.user_id
      ),

      GroupSettlementsSent AS (
        SELECT
          from_user_id AS user_id,
          SUM(amount) AS settlements_sent
        FROM settlements
        WHERE group_id = ${groupId}
        GROUP BY from_user_id
      ),

      GroupSettlementsReceived AS (
        SELECT
          to_user_id AS user_id,
          SUM(amount) AS settlements_received
        FROM settlements
        WHERE group_id = ${groupId}
        GROUP BY to_user_id
      )

      SELECT
        u.id AS user_id,
        u.username,
        g.name AS group_name,

        COALESCE(p.total_paid, 0) AS total_paid,
        COALESCE(o.total_owed, 0) AS total_owed,

        COALESCE(ss.settlements_sent, 0) AS settlements_sent,
        COALESCE(sr.settlements_received, 0) AS settlements_received

      FROM group_members gm

      JOIN profiles u
        ON gm.user_id = u.id

      JOIN groups g
        ON gm.group_id = g.id

      LEFT JOIN GroupPaid p
        ON u.id = p.user_id

      LEFT JOIN GroupOwed o
        ON u.id = o.user_id

      LEFT JOIN GroupSettlementsSent ss
        ON u.id = ss.user_id

      LEFT JOIN GroupSettlementsReceived sr
        ON u.id = sr.user_id

      WHERE gm.group_id = ${groupId};
    `);

    return balanceResult.rows;

  } catch (error) {
    console.error(
      "Error in getUserGroupBalanceData model:",
      error
    );

    throw error;
  }
}
//3.Get all expenses
export async function getAllExpense(groupId: number): Promise<
  {
    Id: number;
    UserName: string;
    Description: string;
    Amount: number;
  }[]
> {
  try {
    const allExpenseResult = await db
    .select({
      id:expenses.id,
      username:profiles.username,
      description:expenses.description,
      amount:expenses.amount,
      createdAt:expenses.createdAt
    })
    .from(expenses)
    .innerJoin(profiles,eq(expenses.paidBy,profiles.id))
    .where(eq(expenses.groupId,groupId))
    .orderBy(desc(expenses.amount));
    return allExpenseResult.map((row) => ({
      Id: row.id,
      UserName: row.username,
      Description: row.description,
      Amount: Number(row.amount),
    }));
  } catch (error) {
    console.error("Error in getAllExpense model:", error);
    throw error;
  }
}
