import { ZodError} from 'zod';
import { Request,Response,NextFunction } from 'express';
interface CustomError extends Error{
    statusCode?:number;
}
const error = (err:CustomError|ZodError|any,req:Request,res:Response,next:NextFunction):Response |void =>{
    console.error("Central Error Handler caught:",err);
    //what the instanceof keyword do
    if(err instanceof ZodError)
    {
        return res.status(400).json(
            {
                success:false,
                message:"Validation Failed",
                //why we need map here what it will show
                errors:err.issues.map(e =>
                (
                    {
                        field:e.path.join('.'),
                        message:e.message
                    }
                )
                )
            }
        );
    }
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(
        {
            success:false,
            message:err.message || "Something went wrong on our server"
        }
    )
};
export default error;