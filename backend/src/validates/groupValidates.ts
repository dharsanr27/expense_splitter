import { z } from "zod";

export const groupCreateSchema = z.object({
  body: z.object({
    groupName: z.string().min(1).max(255),
  }),
  user: z.object({
    userId: z.string(),
  }),
});

export const addMemberSchema = z.object({
    params:z.object({
        groupId:z.coerce.number().int().positive(),
    }),
    body:z.object({
        userId:z.string(),
    }),
});

export const membersSchema = z.object({
    params:z.object({
        groupId:z.coerce.number().int().positive(),
    }),
});

export  const userGroupSchema = z.object({
   user: z.object({
    userId: z.string(),
  }),
})


//q2:zod change the object or just check