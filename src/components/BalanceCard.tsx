import { StyleSheet, Text, View } from "react-native";

type BalanceCardProps = {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
};

export default function BalanceCard({
  balance,
  totalIncome,
  totalExpenses,
}: BalanceCardProps) {
  const money = (value: number) =>
    `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceLabel}>
        TOTAL BALANCE
      </Text>

      <Text style={styles.balanceAmount}>
        {money(balance)}
      </Text>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={styles.whiteAmount}>
            {money(totalIncome)}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={styles.whiteAmount}>
            {money(totalExpenses)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
