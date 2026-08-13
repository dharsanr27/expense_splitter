import {db} from "../db";
import { profiles } from "../db/schema";
import { ilike } from "drizzle-orm";
import { Profiles } from "../types";
export async function getUserByName(userName:string):Promise<Profiles[]> {
  try {
   
    const result = await db
    .select({
      id:profiles.id,
      username:profiles.username,
    })
    .from(profiles)
    .where(ilike(profiles.username,`%${userName}%`))
    .limit(10);
    return result;
  } catch (error) {
    console.error("Error in getUserByName model:", error);
    throw error;
  }
}

