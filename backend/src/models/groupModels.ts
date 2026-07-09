//does we need to add pool to every models
import { promises } from "node:dns";
import pool from "../config/database";
import {Group,GroupMember} from "../types/index";
//1.Create group
export async function createGroup(groupName:string,createdBy:number):Promise<Group>
{
    const client = await pool.connect();
    try{
        await client.query("BEGIN");

        const  GroupCreatSql=`
        insert into groups(name,created_by)
        values($1,$2)
        returning *;`;
        const result = await client.query(GroupCreatSql,[groupName,createdBy]);
        const groupId = result.rows[0].id;
        const MemberaddSql=`
        insert into group_members(group_id,user_id)
        values($1,$2)
        returning *;`;
        const AddResult = await client.query(MemberaddSql,[groupId,createdBy]);
        await client.query("COMMIT");
        return result.rows[0];
    }
    catch(error)
    {
        await client.query("ROLLBACK");
        console.error("Error in createGroup model",error);
        throw error;
    }
    finally{
        client.release();
    }
}
//2.ADD members to the group
export async function addMemberToGroup(groupId:number,userId:number):Promise<GroupMember>
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
//3.members in the group


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

//4.user group they are in
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