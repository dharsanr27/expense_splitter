const pool = require("../config/database.js");

async function createSettlement(groupId,fromUserId,toUserId,amount)
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
}module.exports = { createSettlement}