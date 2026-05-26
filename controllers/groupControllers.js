const {createGroup}= require("../models/groupModels.js");
//1.Group creation
async function handleCreateGroup(req,res)
{
    try{
const {groupName,createdBy}= req.body;
if(!groupName || !createdBy)
{
    res.status(400).json(
        {
            success:false,
            message:"All fields are required"
        }
    );
}
    const newGroup = await createGroup(groupName,createdBy);
    //diff btw 201 and 200
    return res.status(201).json(
        {
            success:true,
            message:"Group created succesfully",
            data:newGroup
        }
    );

    }
    catch(error)
    {
        console.error("Error in group creation controller:",error);
        return res.status(500).json(
            {
                success:false,
                message:"something went wrong on the server"
            }
        );
    }
}
module.exports = {handleCreateGroup}