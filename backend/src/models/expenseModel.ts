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
export async function getUserGroupBalance(groupId:number, userId:number):Promise<{
  GroupId: number;
  GroupName: string;
  UserName: string;
  TotalAmountPaid: number;
  TotalAmountOwed: number;
  NetBalanceAmount: number;
}> {
  //Task 3: try to modify this two querry into one querry
  try {
    //TO find the total amount paid by the user in a specific group
    const balanceSql = `
       select (select username from users where id=$2) as username, (select name from groups where id=$1) as group_name,
       coalesce((select sum(amount) from expenses where group_id=$1 and paid_by=$2),0) as total_paid,
       coalesce((select sum(amount) from settlements where from_user_id=$2 and group_id=$1),0) as settlements_send,
       coalesce((select sum(amount) from settlements where to_user_id=$2 and group_id=$1),0) as settlements_recieved,
       coalesce((select sum(amount_owed) from splits where user_id=$2 and expense_id in (select id from expenses where group_id=$1)),0) as total_owed;`;
    const balanceResult = await pool.query(balanceSql, [groupId, userId]);
    const totalPaid = parseFloat(balanceResult.rows[0].total_paid);
    const totalOwed = parseFloat(balanceResult.rows[0].total_owed);
    const settlementsSent = parseFloat(balanceResult.rows[0].settlements_send);
    const settlementsRecieved = parseFloat(
      balanceResult.rows[0].settlements_recieved,
    );
    const groupName = balanceResult.rows[0].group_name || "Unknown Group";
    const username = balanceResult.rows[0].username || "Unknown User";
    const netBalance =
      totalPaid + settlementsSent - (totalOwed + settlementsRecieved);
    return {
      GroupId: groupId,
      GroupName: groupName,
      UserName: username,
      TotalAmountPaid: totalPaid,
      TotalAmountOwed: totalOwed,
      NetBalanceAmount: netBalance,
    };
  } catch (error) {
    console.error("Error in getUserGroupBalance model:", error);
    throw error;
  }
}
//SHOW ALL USERS EXPENSE AND SPLITS IN A GROUP
export interface GroupExpenseSummary
{
  group_name: string;
  username: string;
  user_id: number;
  total_expense_paid: number | string; // Postgres SUM returns a string/numeric
  total_splits_owed: number | string;
}
export async function getUsersExpensesWithSplits(groupId:number):Promise<GroupExpenseSummary[]> {
  try {
    //can i write is exact query by using form users
    const sql = `select
    g.name as group_name,
    u.username,
    u.id as user_id,
    coalesce(e.total_paid,0) as total_expense_paid,
    coalesce(s.total_owed,0) as total_splits_owed
    from group_members gm
    join groups g on gm.group_id = g.id
    join users u on gm.user_id = u.id
    --Subquery to calculate total expense of the user
    left join(select paid_by,sum(amount) as total_paid
    from expenses
    where group_id =$1
    group by paid_by) e on u.id = e.paid_by
    --Subquery to calculate total owed by the user
    left join(select splits.user_id,sum(splits.amount_owed) as total_owed from splits 
    join expenses ex on splits.expense_id = ex.id
    where group_id =$1
    group by splits.user_id) s on u.id = s.user_id
    where gm.group_id =$1;
  `;
    const result = await pool.query<GroupExpenseSummary>(sql, [groupId]);
    return result.rows;
  } catch (error) {
    console.error("Error in getUserExpensesWithSplits model:", error);
    throw error;
  }
}

