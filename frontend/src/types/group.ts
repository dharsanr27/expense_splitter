export type Balance = {
  GroupId: number;
  GroupName: string;
  UserId: string;
  UerName: string;
  TotalAmountPaid: number;
  TotalAmountOwed: number;
  NetBalanceAmount: number;
};

export type Settlement = {
  fromUserId:string;
  fromUserName:string;
  toUserId:string;
  toUserName:string;
  amount:number;
}
export type Member ={
    id:string;
    username:string;
}
