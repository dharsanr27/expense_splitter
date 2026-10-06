import { getUserGroupBalance } from "../models/expenseModel.js";
import { calculateNetBalance } from "../utils/groupBalance.js";

export async function getUserGroupBalanceData(groupId: number) {
  const rows = await getUserGroupBalance(groupId);

  return rows.map((row) => {
    const totalPaid = Number(row.total_paid);
    const totalOwed = Number(row.total_owed);
    const settlementsSent = Number(row.settlements_sent);
    const settlementsReceived = Number(row.settlements_received);

    const netBalance = calculateNetBalance(
      totalPaid,
      totalOwed,
      settlementsSent,
      settlementsReceived
    );

    return {
      GroupId: groupId,
      GroupName: row.group_name ?? "Unknown Group",
      UserId: row.user_id,
      UserName: row.username ?? "Unknown User",
      TotalAmountPaid: totalPaid,
      TotalAmountOwed: totalOwed,
      NetBalanceAmount: netBalance,
    };
  });
}