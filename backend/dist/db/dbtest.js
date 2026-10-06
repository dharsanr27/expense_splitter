import { db } from "./index.js";
import { profiles } from "./schema.js";
async function main() {
    const users = await db.select().from(profiles).limit(1);
    // console.log(users);
}
main();
