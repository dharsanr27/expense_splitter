import { JwtPayload } from 'jsonwebtoken';

export interface User{
    id:number;
    username:string;
    email:string;
    created_at:Date;
    password?:string;
    //why we are not mentioning password here

}

export interface Group{
   id: number;
   name: string;
   created_by: number;
   created_at?: Date;
}
// 3. The Expense Entity
export interface Expense {
    id: number;
    group_id: number;
    paid_by: number;
    description: string;
    amount: number;
    created_at?: Date;
}
export type SplitStatus = 'pending' | 'paid' | 'cancelled';
// 4. The "Split" Entity (How much each person owes)
export interface Split {
    id: number;
    expense_id: number;
    user_id: number;
    amount_owed: number;
    status:SplitStatus;
}

export interface UserPayload extends JwtPayload {
    userId: number;
    // email: string;
    // role: 'admin' | 'user';
}