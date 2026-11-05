import { z } from "zod";

import { Request, Response, NextFunction } from "express";

const validate = (schema: z.ZodObject<any>) => {

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      
     
      const result = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
        user:req.user,
      });
      req.body = result.body;
      req.params = result.params as any;
 
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
export default validate;

