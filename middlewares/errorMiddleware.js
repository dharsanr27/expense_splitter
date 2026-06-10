const { ZodError} = require('zod');
const error = (err,req,res,next) =>{
    console.error("Central Error Handler caught:",err);
    //what the instanceof keyword do
    if(err instanceof ZodError)
    {
        return res.status(400).json(
            {
                success:false,
                message:"Validation Failed",
                //why we need map here what it will show
                errors:err.errors.map(e =>
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
module.exports = error;