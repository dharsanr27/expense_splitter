import { Request, Response } from "express";
import { getUserGroupBalance } from '../models/expenseModel';
import { calculateSimplifiedDebts } from '../utils/deptCalculator';

export const getGroupDashboardData = async (req: Request, res: Response) => {
  try {
    const groupId = Number(req.params.groupId);

    // 1. Fetch raw balances from PostgreSQL (The query we wrote earlier)
    const rawBalances = await getUserGroupBalance(groupId);

    // 2. Pass the raw balances into the memory algorithm
    const simplifiedTransactions = calculateSimplifiedDebts(rawBalances);

    // 3. Send everything to React
     res.status(200).json({
      success: true,
      data: {
        balances: rawBalances,           // Used for the user list mapping
        settlements: simplifiedTransactions // Used for the "Pay Now" actions
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};