
import rateLimit,{RateLimitRequestHandler} from 'express-rate-limit';


const apiLimiter:RateLimitRequestHandler = rateLimit(
    {
        windowMs: 15*60*1000,
        max:100,
        message: {
            status:429,
            error:"Too many request ,please try again later."
        },
        standardHeaders:true,
        legacyHeaders:false,
    }
)
export default apiLimiter;