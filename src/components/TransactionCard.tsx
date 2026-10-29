import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { Transaction } from "../types/transaction";

type TransactionCardProps = {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

export default function TransactionCard({
  transaction,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  const money = (value: number) =>
    `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
            <View style={styles.transaction} >
              <View style={styles.transactionTop}>
                <View
                  style={[
                    styles.transactionIcon,
                    transaction.type === "income"
                      ? styles.incomeIcon
                      : styles.expenseIcon,
                  ]}
                >
                  <Text style={styles.iconText}>
                    {transaction.type === "income" ? "+" : "-"}
                  </Text>
                </View>

                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionCategory}>
                    {transaction.category}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.type === "income"
                      ? styles.incomeAmount
                      : styles.expenseAmount,
                  ]}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {money(transaction.amount)}
                </Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => onEdit(transaction)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => onDelete(transaction)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>

  );
}

const styles = StyleSheet.create({
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
});