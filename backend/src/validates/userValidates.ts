import {z} from "zod"

export const userSchema = z.object({
    query:z.object({
        search:z.string().min(1).max(255),
    })
})