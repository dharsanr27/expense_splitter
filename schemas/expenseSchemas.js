const {z} = require("zod");
//expense
const expenseSplitSchema = z.object(
    {

        //is z mentioning what 
       groupId:z.number().int().positive(),
       paidBy:z.number().int().positive(),
       tatalAmount:z.number().positive(),
       description:z.string().min(1).max(255)
    }
);
const UserBalanceSchema = z.object(
    {
        groupId:z.number().int().positive(),
        userId:z.number().int().positive()
    }
);

const groupExpenseWithSplitSchema = z.object(
    {
        groupId:z.coerce.number().int().positive()
    }
);

module.exports = { expenseSplitSchema,UserBalanceSchema,groupExpenseWithSplitSchema};
//what is the diff btw module.eports and esc modules