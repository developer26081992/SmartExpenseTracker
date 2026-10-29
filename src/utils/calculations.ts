import type { Transaction } from "../types/transaction";

export function calculateTotals(transactions: Transaction[]) {
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    balance,
  };
}
