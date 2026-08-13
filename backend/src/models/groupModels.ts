//does we need to add pool to every models
// import { promises } from "node:dns";
import { InferSelectModel,eq } from "drizzle-orm";
import {db} from "../db";
import {profiles,groups,groupMembers} from "../db/schema";


//1.Create group
type Group = InferSelectModel<typeof groups>;
export async function createGroup(groupName:string,createdBy:string):Promise<Group>
{
    
    try{
        const newGroup = await db.transaction(async (tx) =>{
            const [group] = await tx 
            .insert(groups)
            .values({name:groupName, createdBy })
            .returning();

        await tx
            .insert(groupMembers)
            .values({groupId: group.id, userId: createdBy})
            .returning();

        return group;
        });

        return newGroup;
       
    }
    catch(error)
    {
        
        console.error("Error in createGroup model",error);
        throw error;
    }
    
}
//2.ADD members to the group
type GroupMember = InferSelectModel<typeof groupMembers>;
export async function addMemberToGroup(groupId:number,userId:string):Promise<GroupMember>
{
    try{
        
        const [member] = await db
        .insert(groupMembers)
        .values({groupId,userId})
        .returning();
        
        return member;
    }
    catch(error)
    {
        console.error("Error in addmember model:",error);
        throw error;
    }
}


//3.members in the group
 interface Member {
    id: string;
    username: string;
}
export async function memberList(groupId:number):Promise<Member[]>
{
    try{
        // console.time("DB");
        const result= await db
        .select({
            id:profiles.id,
            username:profiles.username,
        })
        .from(profiles)
        .innerJoin(groupMembers,eq(profiles.id,groupMembers.userId))
        .where(eq(groupMembers.groupId,groupId));
         console.timeEnd("DB");
        return result;
    }
    catch(error)
    {
        console.error("Error in memberList model:",error);
         throw error;
    }
}

//4.user group they are in
 interface UserGroup {
    id: number;
    name: string;
}
export async function userGroups(userId:string):Promise<UserGroup[]>
{
    try{
        const result =await db
        .select({id:groups.id,name:groups.name})
        .from(groups)
        .innerJoin(groupMembers,eq(groups.id,groupMembers.groupId))
        .where(eq(groupMembers.userId,userId))
        return result;
    }
    catch(error)
    {
        console.error("Error in userGroups model:",error);
        throw error;
    }
  
}
  //Task1:remove all the promise<any>