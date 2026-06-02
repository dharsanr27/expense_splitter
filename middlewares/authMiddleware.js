//why ai generated code gives require without .js extension
const jwt = require('jsonwebtoken');
function auth(req,res,next)
{    
    console.log("====================================");
    console.log("1. Incoming URL:", req.originalUrl);
    console.log("2. ALL HEADERS:", req.headers); // Tells us everything the client sent
    console.log("3. AUTH HEADER VALUE:", req.header('Authorization'));
    console.log("====================================");
    const authHeader = req.header('Authorization');//what is the use of this line
    if(!authHeader || !authHeader.startsWith('Bearer'))//what is bearer
    {
       return res.status(401).json(
        {
            success:false,
            message:'No token,authorization denied'
        }
       )
    }
    const token = authHeader.split(' ')[1];//what is the purpose of this line
    try{
        const decode =jwt.verify(token,process.env.JWT_SECRET);
        req.user =decode;//what it will store
        next();//why we need next how it know next where to go
    }
    catch(error)
        {
           return  res.status(401).json(
                {
                    message:'Token is invalid'
                }
             );
        }
    

}
module.exports = {auth};