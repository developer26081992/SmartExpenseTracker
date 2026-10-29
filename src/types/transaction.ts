export type TransactionType = "income" | "expense";

export type Transaction = {
  id: number;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
};
