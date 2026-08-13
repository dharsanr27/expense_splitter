import { BaseResponse } from "./common.types";

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