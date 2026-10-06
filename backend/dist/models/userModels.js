import { db } from "../db/index.js";
import { profiles } from "../db/schema.js";
import { ilike } from "drizzle-orm";
export async function getUserByName(userName) {
    try {
        const result = await db
            .select({
            id: profiles.id,
            username: profiles.username,
        })
            .from(profiles)
            .where(ilike(profiles.username, `%${userName}%`))
            .limit(10);
        return result;
    }
    catch (error) {
        console.error("Error in getUserByName model:", error);
        throw error;
    }
}
