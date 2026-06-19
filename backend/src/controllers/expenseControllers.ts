import { Request, Response, NextFunction } from "express";
import { createExpenseWithSplits, getUserGroupBalance } from "../models/expenseModel";
import sanitizeInput  from "../utils/sanitize";

export async function handleExpenseWithSplitCreation(req:Request,res:Response,next:NextFunction):Promise<any> {
    try{
        const {groupId,paidBy,totalAmount,description}=req.body;
        const parsedGroupId = Number(groupId);
        console.log(parsedGroupId)
        const parsedTotalAmount = Number(totalAmount);
       
        //sanitize the description input
        const cleanDescription = sanitizeInput(description);
        const newExpense = await createExpenseWithSplits(parsedGroupId,paidBy,parsedTotalAmount,cleanDescription);
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
 const {groupId} = req.params;

    const newUserBalance = await getUserGroupBalance(parseInt(groupId as string));
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
