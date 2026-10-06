// import pool from "../config/database";

// export async function createSettlement(groupId:number,fromUserId:string,toUserId:string,amount:number):Promise<any>
// {
//     const client = await pool.connect();
//     try{
//         //temporary
//         const expenseIdSql=`
//         select id from expenses
//         where group_id=$1 and paid_by=$2;`;
//         const expensIdResult= await pool.query(expenseIdSql,[groupId,toUserId]);
//         if (expensIdResult.rows.length === 0) {
//             throw new Error(`No pending expenses found for group ${groupId} paid by user ${toUserId}`);
//         }
//         const expenseId=expensIdResult.rows[0].id;
//         await client.query("BEGIN")
//         const settlementSql =`
//         insert into settlements(group_id,from_user_id,to_user_id,amount)
//         values($1,$2,$3,$4)
//         returning * ;`;
//         const settlementResult = await client.query(settlementSql,[groupId,fromUserId,toUserId,amount]);
//         await client.query("COMMIT");
//         return settlementResult.rows[0];
        
//     }
//     catch(error)
//     {    await client.query("ROLLBACK");
//         console.error("Error in createSettlements models:",error);
//         throw error;

//     }
//     finally{
//         client.release();
//     }
// }


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

    // Note: expenseId is currently only retrieved because
    // your original logic retrieved it. It is not used
    // in the settlement INSERT.

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