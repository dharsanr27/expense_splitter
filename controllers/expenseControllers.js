const { createExpenseWithSplits, getUserGroupBalance } = require("../models/expenseModel.js");


async function handleExpenseWithSplitCreation(req,res) {
    try{
        const {groupId,paidBy,totalAmount,description}=req.body;
        if(!groupId || !paidBy || !totalAmount || !description)
        {
            res.status(400).json
            ({
                success:false,
                message:"All fields are required"
            });
        }
        const newExpense = await createExpenseWithSplits(groupId,paidBy,totalAmount,description);
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
        res.status(500).json(
            {
                success:false,
                message:"Something went wrong in server"
            }
        )
    }
    
}
async function  handleUserBalance(req,res)
{
    try{
const {groupId,userId}=req.body;
if(!groupId || !userId)
{
    res.status(400).json(
        {
            success:false,
            message:"All fields are needed"
        }
    );
}
    const newUserBalance = await getUserGroupBalance(groupId,userId);
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
        console.error("Error in getUserGroupBalance controller:",error);
        res.status(500).json(
            {
                success:false,
                message:"Something went wrong in server"
            }
        )

    }

}
module.exports ={handleExpenseWithSplitCreation,handleUserBalance}