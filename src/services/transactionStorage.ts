import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Transaction } from "../types/transaction";

const STORAGE_KEY = "@smart_expense_transactions";

export async function loadStoredTransactions(): Promise<Transaction[] | null> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);

  if (saved === null) {
    return null;
  }

  const parsed: unknown = JSON.parse(saved);

  if (!Array.isArray(parsed)) {
    throw new Error("Stored transactions are not an array.");
  }

  return parsed as Transaction[];
}

export async function saveStoredTransactions(
  transactions: Transaction[]
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );
}
