//does we need to add pool to every models
const pool = require("../config/database.js");
async function createGroup(groupName,createdBy)
{
    try{
        //why we use returning *
        const sql =`
        insert into groups(name,created_by)
        values($1,$2)
        returning *;`;
        const result = await pool.query(sql,[groupName,createdBy]);
        return result.rows[0];

    }
    catch(error)
    {
        console.error("Error in createGroup model",error);
        throw error;
    }
}
module.exports = {createGroup};