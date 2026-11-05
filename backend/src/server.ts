import dotenv from "dotenv"; 
dotenv.config();
import express, { Request, Response } from "express";
import userRouter from "./routes/userRoutes.js";
import groupRouter from "./routes/groupRoutes.js";
import expenseRouter from "./routes/expenseRoutes.js";
import settlementRouter from "./routes/settlementRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js"
import cors from "cors";
import rateLimit from "./middlewares/rateLimitMiddleware.js";
import "./config/redis.js";



const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimit);


//attach user routes to a base path
app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/settlements", settlementRouter);
app.use("/api/dashboardData",dashboardRouter)

// 4. Port Configuration (Professional Defaulting)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

