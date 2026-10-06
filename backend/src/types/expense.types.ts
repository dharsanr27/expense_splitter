import { BaseResponse } from "./common.types.js";

export interface ExpenseCreation{
  expenseId: number;
  groupId: number;
  paidBy: string;
  totalAmount: number;
  splitAmount: number;
  totalMembers: number;
}
export interface GroupBalance{
  GroupId: number;
  GroupName: string;
  UserId:string;
  UserName: string;
  TotalAmountPaid: number;
  TotalAmountOwed: number;
  NetBalanceAmount: number;
}