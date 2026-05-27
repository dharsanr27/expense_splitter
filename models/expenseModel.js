const pool = require("../config/database.js");
//Task 2: don't forget to add a function to avoid duplicates in expense table
//1.create Expense with splits
async function createExpenseWithSplits(groupId,paidBy,totalAmount,description)
{   //why we are using the pool.connect
    //what is transaction concept
    const client =await pool.connect();
    try{
        
        await client.query("BEGIN");//transaction begins
        //1.Insert into master expense & get id
        const expenseSql =`
        insert into expenses(group_id,paid_by,amount,description)
        values($1,$2,$3,$4)
        returning id;`;
        //why it is wrong to give returniing * and then get the
        //id by same const expenseId = expenseResult.rows[0].id
        const expenseResult = await client.query(expenseSql,[groupId,paidBy,totalAmount,description])
        const expenseId = expenseResult.rows[0].id;
        //2.fetch all members of the group
        const membersSql = `
        select user_id from group_members
        where group_id=$1;`;
        const memberResult= await client.query(membersSql,[groupId]);
        //why we don't use await in members variable because memberResult awaits so members variable to 
        const members= memberResult.rows;
        const totalMembers= members.length;
        //3.calculate the equal splits amount
        const splitAmount = totalAmount/totalMembers;
        //automatically loop and insert into splits
        for( const member of members)
        {
            const splitSql =`
            insert into splits(expense_id,user_id,amount_owed)
            values($1,$2,$3);`;
            await client.query(splitSql,[expenseId,member.user_id,splitAmount])
        }
        
        await client.query('COMMIT') //Save everything if no errors occured
   return {
            expenseId: expenseId,
            groupId: groupId,
            paidBy: paidBy,
            totalAmount: totalAmount,
            splitAmount: splitAmount,
            totalMembers: totalMembers
        };
    }
   catch(error)
   {
       await client.query('ROLLBACK');//erase everything from this attempt
       throw error;
   }
   finally 
   {
    client.release();//give connection back to pool
   }
}
//2.Check user balance
async function getUserGroupBalance(groupId,userId)
{   //Task 3: try to modify this two querry into one querry
    try{
        //TO find the total amount paid by the user in a specific group
       const balanceSql =`
       select (select username from users where id=$2) as username, (select name from groups where id=$1) as group_name,
       coalesce((select sum(amount) from expenses where group_id=$1 and paid_by=$2),0) as total_paid,
       coalesce((select sum(amount_owed) from splits where user_id=$2 and expense_id in (select id from expenses where group_id=$1)),0) as total_owed;`;
       const balanceResult = await pool.query(balanceSql,[groupId,userId]);
       const totalPaid = balanceResult.rows[0].total_paid;
       const totalOwed =balanceResult.rows[0].total_owed;
       const groupName =balanceResult.rows[0].group_name;
       const username = balanceResult.rows[0].username;
       const netBalance = totalPaid - totalOwed;
       return{
        GroupId:groupId,
        GroupName:groupName,
        UserName: username,
        TotalAmountPaid:totalPaid,
        TotalAmountOwed:totalOwed,
        NetBalanceAmount:netBalance
       };

    }
    catch(error){
        console.error("Error in getUserGroupBalance model:",error);
        throw error;

    }
}
module.exports = {createExpenseWithSplits,getUserGroupBalance};