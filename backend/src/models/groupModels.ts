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

export async function memberList(groupId:number):Promise<any>
{
    try{
        const sql = `select id,username from users as u
        join group_members as gm on u.id=gm.user_id
        where group_id=$1;`;
        const result= await pool.query(sql,[groupId]);
        return result.rows;
    }
    catch(error)
    {
        console.error("Error in memberList model:",error)
    }
}
export async function userGroups(userId:number):Promise<any>
{
    try{
         const sql=`select id,name from groups
         join group_members on groups.id=group_members.group_id
        where user_id=$1;`;
        const result =await pool.query(sql,[userId]);
        return result.rows;
    }
    catch(error)
    {
        console.error("Error in userGroups model:",error);
    }
  
}