import {z} from "zod"


export const settlement = z.object({
    body:z.object({
        groupId:z.coerce.number().int().positive(),
        fromUserId:z.string(),
        toUserId:z.string(),
        amount:z.number().positive()
    })
})