

export interface Profiles{
    id:string;
    username:string;
    created_at?:Date;
}

export interface Group{
   id: number;
   name: string;
   created_by: string;
   created_at?: Date;
}

export interface GroupMember{
    group_id:number ;
    user_id:string ;
    joined_at?:Date ;
}
// 3. The Expense Entity
export interface Expense {
    id: number;
    group_id: number;
    paid_by: string;
    description: string;
    amount: number;
    created_at?: Date;
}
export type SplitStatus = 'pending' | 'paid' | 'cancelled';
// 4. The "Split" Entity (How much each person owes)
export interface Split {
    id: number;
    expense_id: number;
    user_id: string;
    amount_owed: number;
    status:SplitStatus;
}

export interface UserPayload  {
    userId: string;
    // email: string;
    // role: 'admin' | 'user';
}