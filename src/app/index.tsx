import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ScrollViewInstance,
} from "react-native";

type TransactionType = "income" | "expense";

type Transaction = {
  id: number;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
};

const STORAGE_KEY = "@smart_expense_transactions";

const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Education",
  "Entertainment",
  "Other",
];

const INCOME_CATEGORIES = ["Salary", "Business", "Allowance", "Gift", "Other"];

const sampleTransactions: Transaction[] = [
  {
    id: 1,
    title: "Salary",
    category: "Income",
    amount: 1200,
    type: "income",
  },
  {
    id: 2,
    title: "Groceries",
    category: "Food",
    amount: 45,
    type: "expense",
  },
  {
    id: 3,
    title: "Transport",
    category: "Travel",
    amount: 20,
    type: "expense",
  },
  {
    id: 4,
    title: "Internet",
    category: "Bills",
    amount: 30,
    type: "expense",
  },
];

export default function HomeScreen() {
  const scrollRef = useRef<ScrollViewInstance>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");

  useEffect(() => {
    async function loadTransactions() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
          const parsed: unknown = JSON.parse(saved);

          setTransactions(
            Array.isArray(parsed)
              ? (parsed as Transaction[])
              : sampleTransactions,
          );
        } else {
          setTransactions(sampleTransactions);
        }
      } catch (error) {
        console.error("Failed to load transactions:", error);
        setTransactions(sampleTransactions);
      } finally {
        setStorageLoaded(true);
      }
    }

    loadTransactions();
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;

    async function saveTransactions() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      } catch (error) {
        console.error("Failed to save transactions:", error);
        Alert.alert("Storage Error", "Could not save your transactions.");
      }
    }

    saveTransactions();
  }, [transactions, storageLoaded]);

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = totalIncome - totalExpenses;

  const money = (value: number) =>
    `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const resetForm = () => {
    setTitle("");
    setCategory("Food");
    setAmount("");
    setType("expense");
    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const editTransaction = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setTitle(transaction.title);
    setCategory(transaction.category);
    setAmount(String(transaction.amount));
    setType(transaction.type);
    setShowForm(true);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  const changeTransactionType = (nextType: TransactionType) => {
    if (nextType === type) return;

    setType(nextType);
    setCategory(nextType === "income" ? "Salary" : "Food");
  };

  const availableCategories =
    type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Preserve older saved categories while editing.
  const categoryOptions =
    category && !availableCategories.includes(category)
      ? [category, ...availableCategories]
      : availableCategories;

  const saveTransaction = () => {
    const parsedAmount = Number(amount);

    if (!title.trim() || !category.trim() || !amount.trim()) {
      Alert.alert("Missing Information", "Please complete all fields.");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Invalid Amount", "Enter an amount greater than zero.");
      return;
    }

    if (editingId !== null) {
      setTransactions((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: title.trim(),
                category,
                amount: parsedAmount,
                type,
              }
            : item,
        ),
      );
    } else {
      setTransactions((current) => [
        {
          id: Math.max(Date.now(), ...current.map((item) => item.id + 1)),
          title: title.trim(),
          category,
          amount: parsedAmount,
          type,
        },
        ...current,
      ]);
    }

    resetForm();
  };

  const deleteTransaction = (transaction: Transaction) => {
    Alert.alert(
      "Delete Transaction",
      `Are you sure you want to delete "${transaction.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTransactions((current) =>
              current.filter((item) => item.id !== transaction.id),
            );

            if (editingId === transaction.id) {
              resetForm();
            }
          },
        },
      ],
    );
  };

  if (!storageLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your transactions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.greeting}>SMART EXPENSE TRACKER</Text>

        <Text style={styles.heading}>My Dashboard</Text>

        <Text style={styles.subtitle}>
          Keep track of where your money goes.
        </Text>

        {/* BALANCE CARD */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>

          <Text style={styles.balanceAmount}>{money(balance)}</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={styles.whiteAmount}>{money(totalIncome)}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={styles.whiteAmount}>{money(totalExpenses)}</Text>
            </View>
          </View>
        </View>

        {/* TRANSACTIONS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Text style={styles.transactionCount}>
            {transactions.length} records
          </Text>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No transactions yet</Text>
            <Text style={styles.emptyText}>
              Add your first income or expense to get started.
            </Text>
          </View>
        ) : (
          transactions.map((item) => (
            <View style={styles.transaction} key={item.id}>
              <View style={styles.transactionTop}>
                <View
                  style={[
                    styles.transactionIcon,
                    item.type === "income"
                      ? styles.incomeIcon
                      : styles.expenseIcon,
                  ]}
                >
                  <Text style={styles.iconText}>
                    {item.type === "income" ? "+" : "-"}
                  </Text>
                </View>

                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{item.title}</Text>
                  <Text style={styles.transactionCategory}>
                    {item.category}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.transactionAmount,
                    item.type === "income"
                      ? styles.incomeAmount
                      : styles.expenseAmount,
                  ]}
                >
                  {item.type === "income" ? "+" : "-"}
                  {money(item.amount)}
                </Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => editTransaction(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteTransaction(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* ADD / EDIT FORM */}
        {showForm ? (
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>
              {editingId !== null ? "Edit Transaction" : "New Transaction"}
            </Text>

            <Text style={styles.fieldLabel}>Transaction name</Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. Groceries"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.fieldLabel}>Amount</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />

            <Text style={styles.fieldLabel}>Transaction type</Text>

            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "expense" && styles.selectedType,
                ]}
                onPress={() => changeTransactionType("expense")}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === "expense" && styles.selectedTypeText,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "income" && styles.selectedType,
                ]}
                onPress={() => changeTransactionType("income")}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === "income" && styles.selectedTypeText,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* CATEGORY SELECTION */}
            <Text style={styles.fieldLabel}>Select category</Text>

            <View style={styles.categoryContainer}>
              {categoryOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.categoryButton,
                    category === option && styles.selectedCategoryButton,
                  ]}
                  onPress={() => setCategory(option)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === option && styles.selectedCategoryText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={saveTransaction}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>
                {editingId !== null ? "Save Changes" : "Save Transaction"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={openAddForm}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>+ Add Transaction</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.footer}>Smart spending starts with tracking.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F7F6",
  },
  loadingText: {
    color: "#176B55",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F7F6",
  },
  content: {
    padding: 22,
    paddingTop: 32,
    paddingBottom: 40,
    maxWidth: 760,
    width: "100%",
    alignSelf: "center",
  },
  greeting: {
    color: "#16836A",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
  heading: {
    color: "#16352D",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 10,
  },
  subtitle: {
    color: "#728078",
    fontSize: 14,
    marginTop: 7,
    marginBottom: 24,
  },
  balanceCard: {
    backgroundColor: "#176B55",
    borderRadius: 22,
    padding: 24,
    marginBottom: 30,
  },
  balanceLabel: {
    color: "#D3EDE4",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 26,
  },
  summaryRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#438775",
    paddingTop: 18,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    color: "#D3EDE4",
    fontSize: 13,
    marginBottom: 6,
  },
  whiteAmount: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#16352D",
    fontSize: 19,
    fontWeight: "800",
  },
  transactionCount: {
    color: "#728078",
    fontSize: 12,
  },
  transaction: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  transactionTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  incomeIcon: {
    backgroundColor: "#E1F5E9",
  },
  expenseIcon: {
    backgroundColor: "#FCE9E7",
  },
  iconText: {
    fontSize: 23,
    fontWeight: "700",
    color: "#176B55",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    color: "#233B32",
    fontSize: 15,
    fontWeight: "700",
  },
  transactionCategory: {
    color: "#89958E",
    fontSize: 12,
    marginTop: 5,
  },
  transactionAmount: {
    fontSize: 13,
    fontWeight: "700",
  },
  incomeAmount: {
    color: "#20A464",
    fontSize: 16,
    fontWeight: "700",
  },
  expenseAmount: {
    color: "#D94F4F",
    fontSize: 16,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEF2EF",
  },
  editButton: {
    backgroundColor: "#E1F5E9",
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 18,
  },
  editButtonText: {
    color: "#176B55",
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#FCE9E7",
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 18,
  },
  deleteButtonText: {
    color: "#D94F4F",
    fontWeight: "700",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 22,
    alignItems: "center",
  },
  emptyTitle: {
    color: "#16352D",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    color: "#728078",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },
  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginTop: 16,
  },
  fieldLabel: {
    color: "#233B32",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#F4F7F6",
    borderWidth: 1,
    borderColor: "#DCE5E0",
    borderRadius: 10,
    padding: 13,
    fontSize: 15,
  },
  typeRow: {
    flexDirection: "row",
    gap: 10,
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DCE5E0",
    borderRadius: 10,
    padding: 13,
    alignItems: "center",
  },
  selectedType: {
    backgroundColor: "#176B55",
    borderColor: "#176B55",
  },
  typeText: {
    color: "#233B32",
    fontWeight: "700",
  },
  selectedTypeText: {
    color: "#FFFFFF",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginTop: 4,
    marginBottom: 8,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#DCE5E0",
    backgroundColor: "#F4F7F6",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  selectedCategoryButton: {
    backgroundColor: "#176B55",
    borderColor: "#176B55",
  },
  categoryButtonText: {
    color: "#233B32",
    fontSize: 13,
    fontWeight: "600",
  },
  selectedCategoryText: {
    color: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#176B55",
    borderRadius: 15,
    padding: 17,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  cancelButton: {
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  cancelButtonText: {
    color: "#728078",
    fontWeight: "700",
  },
  footer: {
    color: "#89958E",
    textAlign: "center",
    marginTop: 24,
    fontSize: 12,
  },
});
