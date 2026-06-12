import { Request, Response, NextFunction } from "express";
import { createExpenseWithSplits, getUserGroupBalance, getUsersExpensesWithSplits } from "../models/expenseModel";
import sanitizeInput  from "../utils/sanitize";

export async function handleExpenseWithSplitCreation(req:Request,res:Response,next:NextFunction):Promise<any> {
    try{
        const {groupId,paidBy,totalAmount,description}=req.body;
       
        //sanitize the description input
        const cleanDescription = sanitizeInput(description);
        const newExpense = await createExpenseWithSplits(groupId,paidBy,totalAmount,cleanDescription);
       return res.status(201).json(
            {
                success:true,
                message:"Expense added and Money splitted successfully",
                data: newExpense

            }
        );

    }
    catch(error)
    {
        console.error("error in handleExpenseSplitCreation controller: ",error);
        //how it know that it should go to central error
       next(error);
       //if the error is shown in central error how can we know which compound is making error
    }
    
}
export async function  handleUserBalance(req:Request,res:Response,next:NextFunction):Promise<any> 
{
    try{
const {groupId,userId}=req.body;

    const newUserBalance = await getUserGroupBalance(groupId,userId);
    console.log("🚀 Inside the controller, executing database transaction...");
   return res.status(201).json(
        {
            success:true,
            message:"Net balance is successfully calculated",
            data:newUserBalance
        }
    )

    }
    catch(error)
    {
      next(error);

    }

}
export async function handleGetUsersExpensesWithSplits(req:Request,res:Response,next:NextFunction):Promise<any> 
{
    //for get request get don't have a body
    try{
         const {groupId} = req.params;
    
    const newGroupExpensesWithSplit = await getUsersExpensesWithSplits(parseInt(groupId as string));//why we are parseInt(groupId)
    if(!newGroupExpensesWithSplit ||newGroupExpensesWithSplit.length ==0){//why !newGroupExpensesWithSplit
        return res.status(200).json(
            {
                success:true,
                message:"No members in this group",
                data:[]
            }
        );
    }
    const groupName = newGroupExpensesWithSplit[0].group_name;
    const userList = [];
    newGroupExpensesWithSplit.forEach(row=>
    {
        userList.push(


            {
                username:row.username,
                totalExpensePaid:parseFloat(String(row.total_expense_paid || 0)),
                totalSplitsOwed:parseFloat(String(row.total_splits_owed || 0))
            }
        )
    }
    )
    res.status(200).json(
        {
            success:true,
            message:"Succesfully got Users Expenses and Splits in the group",
            data:
            {
                groupName:groupName,
                users: userList
            }
        }
    );


    }
    catch(error)
    {
      next(error);
    }
}