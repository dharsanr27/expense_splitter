const { createExpenseWithSplits, getUserGroupBalance, getUsersExpensesWithSplits } = require("../models/expenseModel.js");


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
async function handleGetUsersExpensesWithSplits(req,res)
{
    //for get request get don't have a body
    try{
         const {groupId} = req.params;
    if(!groupId)
    {
        res.status(401).json(
            {
                success:false,
                message:"All fields are required"
            }
        )
    }
    const newGroupExpensesWithSplit = await getUsersExpensesWithSplits(parseInt(groupId));//why we are parseInt(groupId)
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
    newGroupExpensesWithSplit.forEach(row =>
    {
        userList.push(
            {
                username:row.username,
                totalExpensePaid:parseFloat(row.total_expense_paid || 0),
                totalSplitsOwed:parseFloat(row.total_splits_owed || 0)
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
      console.error("Error in handleGetUsersExpensesWithSplits controller:",error)
      res.status(500).json(
        {
            success:false,
            message:"Something went wrong on Server"
        }
      )
    }
   
}
module.exports ={handleExpenseWithSplitCreation,handleUserBalance,handleGetUsersExpensesWithSplits}