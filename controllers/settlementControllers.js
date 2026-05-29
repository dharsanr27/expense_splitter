const { createSettlement } = require("../models/settlementModel");


async function handleCreateSettlement(req,res)
{
try{
    const {groupId,fromUserId,toUserId,amount}=req.body;
    if(!groupId || !fromUserId || !toUserId || !amount)
    {
        res.status(401).json(
            {
                success:false,
                message:"All fields are required"
            }
        )
    }
    const newSettlement = await createSettlement(groupId,fromUserId,toUserId,amount);
    res.status(201).json(
        {
            success:true,
            message:"Settlement succesfully added",
            data:newSettlement
        }
    )

}
catch(error)
{
    console.error("Error in handleCreateSettlement controller:",error);
    res.status(500).json(
        {
            success:false,
            message:"Something went wrong on server"
        }
    )

}
}

module.exports = { handleCreateSettlement}