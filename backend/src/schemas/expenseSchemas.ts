const {z} = require("zod");
//expense
export const expenseSplitSchema = z.object(
    {

        //is z mentioning what 
       groupId:z.number().int().positive(),
       paidBy:z.number().int().positive(),
       totalAmount:z.number().positive(),
       description:z.string().min(1).max(255)
    }
);
export const UserBalanceSchema = z.object(
    {
    params:z.object(
    {
        groupId:z.coerce.number().int().positive(),
        
    })
});



//what is the diff btw module.eports and esc modules