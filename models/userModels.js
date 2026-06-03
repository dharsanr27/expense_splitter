const pool = require("../config/database.js");
//1. creating a user
async function createUser(username, email, password) {
  //how should we avoid sql injection
  try {
    const sql = `INSERT INTO users(username,email,password)
    values($1,$2,$3)
    returning id,username,email,created_at;
    `;
    //how to implement invalid email or wrong email
    const result = await pool.query(sql, [username, email, password]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in creatUser model:", error);
    throw error;
  }
}
//2.Authentication(user login)
async function getUserByEmail(email)
{
   try {
     const sql =`
    select * from users
    where email=$1;
    `;
    const result = await pool.query(sql,[email]);
    return result.rows[0];

    }
    catch(error){
   console.error("Error in getUserByEmail model:",error);
   throw error;
    }

}
module.exports = { createUser,getUserByEmail };

