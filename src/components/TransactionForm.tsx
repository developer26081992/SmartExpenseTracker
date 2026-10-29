import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { TransactionType } from "../types/transaction";

type TransactionFormProps = {
  showForm: boolean;
  editingId: number | null;
  title: string;
  amount: string;
  type: TransactionType;
  category: string;
  categoryOptions: string[];
  onChangeTitle: (value: string) => void;
  onChangeAmount: (value: string) => void;
  onChangeCategory: (value: string) => void;
  onChangeType: (value: TransactionType) => void;
  onSave: () => void;
  onCancel: () => void;
  onOpen: () => void;
};

export default function TransactionForm({
  showForm,
  editingId,
  title,
  amount,
  type,
  category,
  categoryOptions,
  onChangeTitle,
  onChangeAmount,
  onChangeCategory,
  onChangeType,
  onSave,
  onCancel,
  onOpen,
}: TransactionFormProps) {
  return (
    <>
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
              onChangeText={onChangeTitle}
            />

            <Text style={styles.fieldLabel}>Amount</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              value={amount}
              onChangeText={onChangeAmount}
              keyboardType="decimal-pad"
            />

            <Text style={styles.fieldLabel}>Transaction type</Text>

            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "expense" && styles.selectedType,
                ]}
                onPress={() => onChangeType("expense")}
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
                onPress={() => onChangeType("income")}
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
                  onPress={() => onChangeCategory(option)}
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
              onPress={onSave}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>
                {editingId !== null ? "Save Changes" : "Save Transaction"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={onOpen}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>+ Add Transaction</Text>
          </TouchableOpacity>
        )}
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#16352D",
    fontSize: 19,
    fontWeight: "800",
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
});