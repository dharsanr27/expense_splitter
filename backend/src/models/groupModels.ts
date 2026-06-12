//does we need to add pool to every models
import { promises } from "node:dns";
import pool from "../config/database";
//1.Create group
export async function createGroup(groupName:string,createdBy:number):Promise<any>
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
//2.ADD members to the group
export async function addMemberToGroup(groupId:number,userId:number):Promise<any>
{
    try{
        const sql = `
        insert into group_members(group_id,user_id)
        values($1,$2)
        returning *;`;
        const result = await pool.query(sql,[groupId,userId]);
        return result.rows[0];
    }
    catch(error)
    {
        console.error("Error in addmember model:",error);
        throw error;
    }
}
