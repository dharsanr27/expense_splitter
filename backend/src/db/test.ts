import { db } from "./index";
import { profiles } from "./schema";

async function main() {
  const users = await db.select().from(profiles).limit(1);
  console.log(users);
}

main();
