export function calculateNetBalance(
  totalPaid: number,
  totalOwed: number,
  settlementsSent: number,
  settlementsReceived: number
): number {
  const netBalance =
    totalPaid +
    settlementsSent -
    totalOwed -
    settlementsReceived;

  return Number(netBalance.toFixed(2));
}