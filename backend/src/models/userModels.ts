import {db} from "../db/index.js";
import { groupMembers, profiles } from "../db/schema.js";
import { and, ilike, notExists, eq } from "drizzle-orm";
import { Profiles } from "../types/index.js";
export async function getUserByName(groupId:number,userName:string):Promise<Profiles[]> {
  try {
   
    const result = await db
    .select({
      id:profiles.id,
      username:profiles.username,
    })
    .from(profiles)
    .where(
      and(
        ilike(profiles.username,`%${userName}%`),
      notExists(
        db
        .select()
        .from(groupMembers)
        .where(
          and(
            eq(groupMembers.userId,profiles.id),
            eq(groupMembers.groupId,groupId),
          ),
        ),
        
      ),
    ),
  )
    .limit(10);
    return result;
  } catch (error) {
    console.error("Error in getUserByName model:", error);
    throw error;
  }
}

