//4.6.26
//1.a N n f
const rateLimit = require('express-rate-limit');

//is it applicable for specific route or whole routes 
const apiLimiter = rateLimit(
    {
        windowMs: 15*60*1000,
        max:100,
        message: {
            status:429,
            error:"Too many request ,please try again later."
        },
        //what is the use of these two below ,what if we don't give
        standardHeaders:true,
        legacyHeaders:false,
    }
)
module.exports = apiLimiter