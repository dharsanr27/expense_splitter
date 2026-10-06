import pool from "../config/database.js";
import { db } from "../db/index.js";
import { eq,sql,desc } from "drizzle-orm";
import { profiles, expenses, groupMembers, splits } from "../db/schema.js";
//Task 2: don't forget to add a function to avoid duplicates in expense table
//1.create Expense with splits
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
  // console.log({ groupId, paidBy, totalAmount, description })
  //why we are using the pool.connect
  //what is transaction concept
  // const client = await pool.connect();
  try {
    const result = await db.transaction(async (tx) => {
      const [expense] = await tx
        .insert(expenses)
        .values({
          groupId,
          paidBy,
          amount: totalAmount.toString(),
          description,
        })
        .returning({
          id: expenses.id,
        });
      const expenseId = expense.id;

      const members = await tx
        .select({
          userId: groupMembers.userId,
        })
        .from(groupMembers)
        .where(eq(groupMembers.groupId, groupId));
      const totalMembers = members.length;

      const splitAmount = totalAmount / totalMembers;

      for (const member of members) {
        await tx.insert(splits).values({
          expenseId,
          userId: member.userId,
          amountOwed: splitAmount.toString(),
        });
      }
      return {
        expenseId,
        groupId,
        paidBy,
        totalAmount,
        splitAmount,
        totalMembers,
      };
    });
    return result;
  } catch (error) {
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
