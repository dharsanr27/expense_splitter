import { Request, Response } from "express";
import { calculateSimplifiedDebts } from '../utils/deptCalculator.js';
import { getUserGroupBalanceData } from "../services/groupBalance.service.js";
import redisClient from "../config/redis.js";
export const getGroupDashboardData = async (req: Request, res: Response):Promise<void> => {
  try {
    const groupId = Number(req.params.groupId);
    const cacheKey = `group:${groupId}:dashboard`;

    const cachedDashboard = await redisClient.get(cacheKey);
   

if (cachedDashboard) {
 
  res.status(200).json({
    success: true,
    data: JSON.parse(cachedDashboard),
  });
  return;
}

    // 1. Fetch raw balances from PostgreSQL (The query we wrote earlier)
    const rawBalances = await getUserGroupBalanceData(groupId);

    // 2. Pass the raw balances into the memory algorithm
    const simplifiedTransactions = calculateSimplifiedDebts(rawBalances);


     const dashboardData = {
      balances: rawBalances,// Used for the user list mapping
      settlements: simplifiedTransactions// Used for the "Pay Now" actions
    };

    await redisClient.set(cacheKey,JSON.stringify(dashboardData),{EX:300});
    
     res.status(200).json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};