import { Request, Response, NextFunction } from "express";
import { createExpenseWithSplits, getAllExpense, getUserGroupBalance } from "../models/expenseModel.js";
import sanitizeInput  from "../utils/sanitize.js";
import redisClient from "../config/redis.js";
import { publishExpenseCreated } from "../lib/realtime.js";

export async function handleExpenseWithSplitCreation(req:Request,res:Response,next:NextFunction):Promise<void> {
    try{
       
        const {groupId,paidBy,totalAmount,description}=req.body;
        const parsedGroupId = Number(groupId);
      
        const parsedTotalAmount = Number(totalAmount);
       
       
        const cleanDescription = sanitizeInput(description);
        const newExpense = await createExpenseWithSplits(parsedGroupId,paidBy,parsedTotalAmount,cleanDescription);
        await redisClient.del(`group:${parsedGroupId}:expenses`);
        await redisClient.del(`group:${parsedGroupId}:dashboard`);
        await publishExpenseCreated(parsedGroupId);
        res.status(201).json(
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
        
       next(error);
       
    }
    
}
export async function  handleUserBalance(req:Request,res:Response,next:NextFunction):Promise<void> 
{
    try{
 const {groupId} = req.params;

    const newUserBalance = await getUserGroupBalance(parseInt(groupId as string));
   
    res.status(201).json(
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

export async function handleAllExpense(req:Request,res:Response,next:NextFunction):Promise<void>
{
    try{
        const {groupId}= req.params;
        const cacheKey = `group:${groupId}:expenses`;
        //1.check redis
        const cachedExpenses = await redisClient.get(cacheKey);
        if (cachedExpenses) {
        res.status(200).json({
        success: true,
        message: "Retrieved all expenses from cache",
        data: JSON.parse(cachedExpenses),
      });
      return;
    }
    //2.cache miss
    
      const newAllExpense = await getAllExpense(parseInt(groupId as string));

      await redisClient.set(cacheKey,JSON.stringify(newAllExpense),{EX:300});

       res.status(201).json(
        {
            success:true,
            message:"Retrieved all expenses in the group",
            data:newAllExpense
        }
      )
    }
    catch(error)
    {
        next(error);
    }
    
}