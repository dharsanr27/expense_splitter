import pool from "../config/database";

export async function createSettlement(groupId:number,fromUserId:number,toUserId:number,amount:number):Promise<any>
{
    try{
        const settlementSql =`
        insert into settlements(group_id,from_user_id,to_user_id,amount)
        values($1,$2,$3,$4)
        returning * ;`;
        const settlementResult = await pool.query(settlementSql,[groupId,fromUserId,toUserId,amount]);
        return settlementResult.rows[0];
    }
    catch(error)
    {
        console.error("Error in createSettlements models:",error);
        throw error;

    }
}