import pool from "../config/database";
import {User} from "../types/index";
//1. creating a user
export async function createUser(
  username:string,
   email:string,
    password:string):Promise<User> {
  //how should we avoid sql injection
  try {
    const sql = `INSERT INTO users(username,email,password)
    VALUES($1,$2,$3)
    RETURNING id,username,email,created_at;
    `;
    //how to implement invalid email or wrong email
    const result = await pool.query<User>(sql, [username, email, password]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in creatUser model:", error);
    throw error;
  }
}
//2.Authentication(user login)
export async function getUserByEmail(email:string):Promise<User | null> {
  try {
    const sql = `
    SELECT * FROM users
    WHERE email=$1;
    `;
    const result = await pool.query<User>(sql, [email]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in getUserByEmail model:", error);
    throw error;
  }
}

