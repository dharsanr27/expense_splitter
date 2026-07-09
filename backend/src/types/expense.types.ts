import { BaseResponse } from "./common.types";

export interface ExpenseCreation{
  expenseId: number;
  groupId: number;
  paidBy: number;
  totalAmount: number;
  splitAmount: number;
  totalMembers: number;
}
export interface GroupBalance{
  GroupId: number;
  GroupName: string;
  UserId:number;
  UserName: string;
  TotalAmountPaid: number;
  TotalAmountOwed: number;
  NetBalanceAmount: number;
}