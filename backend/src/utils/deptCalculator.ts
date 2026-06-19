// Define the input (what your DB query returns)
export interface UserBalance {
  UserId: number;
  UserName: string;
  NetBalanceAmount: number;
}

// Define the output (what React needs to show the UI)
export interface SimplifiedDebt {
  fromUserId: number;
  fromUserName: string;
  toUserId: number;
  toUserName: string;
  amount: number;
}

export function calculateSimplifiedDebts(balances: UserBalance[]): SimplifiedDebt[] {
  // 1. Separate users into Debtors (Negative) and Creditors (Positive)
  // We use Math.abs() on debtors so we are only dealing with positive numbers for the math.
  const debtors = balances
    .filter(b => b.NetBalanceAmount < -0.01) // -0.01 prevents floating point errors
    .map(b => ({ ...b, pendingBalance: Math.abs(b.NetBalanceAmount) }));

  const creditors = balances
    .filter(b => b.NetBalanceAmount > 0.01)
    .map(b => ({ ...b, pendingBalance: b.NetBalanceAmount }));

  // 2. Sort both arrays descending (biggest debts/credits first)
  // This ensures the minimum number of transactions by clearing large balances immediately.
  debtors.sort((a, b) => b.pendingBalance - a.pendingBalance);
  creditors.sort((a, b) => b.pendingBalance - a.pendingBalance);

  const transactions: SimplifiedDebt[] = [];
  let i = 0; // Pointer for debtors
  let j = 0; // Pointer for creditors

  // 3. The Greedy Loop
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    // The settlement amount is whichever is smaller: the debt owed, or the credit needed
    const settleAmount = Math.min(debtor.pendingBalance, creditor.pendingBalance);

    // Record this transaction
    transactions.push({
      fromUserId: debtor.UserId,
      fromUserName: debtor.UserName,
      toUserId: creditor.UserId,
      toUserName: creditor.UserName,
      amount: parseFloat(settleAmount.toFixed(2)) // Keep it clean for currency
    });

    // Deduct the settled amount from both balances
    debtor.pendingBalance -= settleAmount;
    creditor.pendingBalance -= settleAmount;

    // Move the pointers if a user's balance hits zero (using < 0.01 for floating point safety)
    if (debtor.pendingBalance < 0.01) i++;
    if (creditor.pendingBalance < 0.01) j++;
  }

  return transactions;
}