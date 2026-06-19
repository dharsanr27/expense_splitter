import pool from "../config/database";
import { Expense } from "../types/index";
//Task 2: don't forget to add a function to avoid duplicates in expense table
//1.create Expense with splits
export async function createExpenseWithSplits(
  groupId:number,
  paidBy:number,
  totalAmount:number,
  description:string,
):Promise<{
  expenseId: number;
  groupId: number;
  paidBy: number;
  totalAmount: number;
  splitAmount: number;
  totalMembers: number;
}>{
  //why we are using the pool.connect
  //what is transaction concept
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); //transaction begins
    //1.Insert into master expense & get id
    const expenseSql = `
        insert into expenses(group_id,paid_by,amount,description)
        values($1,$2,$3,$4)
        returning id;`;
    //why it is wrong to give returniing * and then get the
    //id by same const expenseId = expenseResult.rows[0].id
    const expenseResult = await client.query<{id:number}>(expenseSql, [
      groupId,
      paidBy,
      totalAmount,
      description,
    ]);
    const expenseId = expenseResult.rows[0].id;
    //2.fetch all members of the group
    const membersSql = `
        select user_id from group_members
        where group_id=$1;`;
    const memberResult = await client.query(membersSql, [groupId]);
    //why we don't use await in members variable because memberResult awaits so members variable to
    const members = memberResult.rows;
    const totalMembers = members.length;
    //3.calculate the equal splits amount
    const splitAmount = totalAmount / totalMembers;
    //automatically loop and insert into splits
    for (const member of members) {

      const splitSql = `
            insert into splits(expense_id,user_id,amount_owed)
            values($1,$2,$3);`;
      await client.query(splitSql, [expenseId, member.user_id, splitAmount]);
    }

    await client.query("COMMIT"); //Save everything if no errors occured
    return {
      expenseId: expenseId,
      groupId: groupId,
      paidBy: paidBy,
      totalAmount: totalAmount,
      splitAmount: splitAmount,
      totalMembers: totalMembers,
     
      
    };
  } catch (error) {
    await client.query("ROLLBACK"); //erase everything from this attempt
    throw error;
  } finally {
    client.release(); //give connection back to pool
  }
}
//2.Check user balance
export async function getUserGroupBalance(groupId:number):Promise<{
  GroupId: number;
  GroupName: string;
  UserId:number;
  UserName: string;
  TotalAmountPaid: number;
  TotalAmountOwed: number;
  NetBalanceAmount: number;
}[]> {
  //Task 3: try to modify this two querry into one querry
  try {
    //TO find the total amount paid by the user in a specific group
    const balanceSql = `
       WITH GroupPaid AS (
          SELECT paid_by AS user_id, SUM(amount) AS total_paid
          FROM expenses 
          WHERE group_id = $1
          GROUP BY paid_by
      ),
      GroupOwed AS (
          SELECT s.user_id, SUM(s.amount_owed) AS total_owed
          FROM splits s 
          JOIN expenses e ON s.expense_id = e.id
          WHERE e.group_id = $1
          GROUP BY s.user_id
      ),
      GroupSettlementsSent AS (
          SELECT from_user_id AS user_id, SUM(amount) AS settlements_sent
          FROM settlements 
          WHERE group_id = $1
          GROUP BY from_user_id
      ),
      GroupSettlementsReceived AS (
          SELECT to_user_id AS user_id, SUM(amount) AS settlements_received
          FROM settlements 
          WHERE group_id = $1
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
      JOIN users u ON gm.user_id = u.id
      JOIN groups g ON gm.group_id = g.id
      LEFT JOIN GroupPaid p ON u.id = p.user_id
      LEFT JOIN GroupOwed o ON u.id = o.user_id
      LEFT JOIN GroupSettlementsSent ss ON u.id = ss.user_id
      LEFT JOIN GroupSettlementsReceived sr ON u.id = sr.user_id
      WHERE gm.group_id = $1;`;
    const balanceResult = await pool.query(balanceSql, [groupId]);
   const allBalances = balanceResult.rows.map(row => {
      const totalPaid = parseFloat(row.total_paid);
      const totalOwed = parseFloat(row.total_owed);
      const settlementsSent = parseFloat(row.settlements_sent);
      const settlementsReceived = parseFloat(row.settlements_received);
      
      const groupName = row.group_name || "Unknown Group";
      const username = row.username || "Unknown User";
      
      // The Core Accounting Math
      const netBalance = totalPaid + settlementsSent - (totalOwed + settlementsReceived);

      return {
        GroupId: groupId,
        GroupName: groupName,
        UserId: parseInt(row.user_id),
        UserName: username,
        TotalAmountPaid: totalPaid,
        TotalAmountOwed: totalOwed,
        NetBalanceAmount: netBalance,
      };
    });
    return allBalances
  } catch (error) {
    console.error("Error in getUserGroupBalance model:", error);
    throw error;
  }
}

