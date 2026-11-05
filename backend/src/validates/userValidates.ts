import {z} from "zod"

export const userSchema = z.object({
    params:z.object({
        groupId:z.coerce.number().int().positive(),
    }),
    query:z.object({
        search:z.string().min(1).max(255),
    })
})