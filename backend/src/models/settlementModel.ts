import pool from "../config/database";

export async function createSettlement(groupId:number,fromUserId:number,toUserId:number,amount:number):Promise<any>
{
    const client = await pool.connect();
    try{
        //temporary
        const expenseIdSql=`
        select id from expenses
        where group_id=$1 and paid_by=$2;`;
        const expensIdResult= await pool.query(expenseIdSql,[groupId,toUserId]);
        if (expensIdResult.rows.length === 0) {
            throw new Error(`No pending expenses found for group ${groupId} paid by user ${toUserId}`);
        }
        const expenseId=expensIdResult.rows[0].id;
        await client.query("BEGIN")
        const settlementSql =`
        insert into settlements(group_id,from_user_id,to_user_id,amount)
        values($1,$2,$3,$4)
        returning * ;`;
        const settlementResult = await client.query(settlementSql,[groupId,fromUserId,toUserId,amount]);
        await client.query("COMMIT");
        return settlementResult.rows[0];
        
    }
    catch(error)
    {    await client.query("ROLLBACK");
        console.error("Error in createSettlements models:",error);
        throw error;

    }
    finally{
        client.release();
    }
}