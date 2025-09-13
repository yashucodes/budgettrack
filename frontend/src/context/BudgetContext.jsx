import React, { createContext, useState, useMemo } from "react";

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budget, setBudget] = useState(0);

  /**
   * addTransaction supports:
   *  - addTransaction({ title, amount, type, date, id })
   *  - addTransaction(title, amount, type)
   */
  const addTransaction = (arg1, arg2, arg3) => {
    let newTransaction;

    if (typeof arg1 === "object" && arg1 !== null && "amount" in arg1) {
      // called with a transaction object
      newTransaction = {
        id: arg1.id || Date.now(),
        title: arg1.title || arg1.category || "",
        amount: Number(arg1.amount),
        type: arg1.type || "expense",
        date: arg1.date || new Date().toLocaleString(),
      };
    } else {
      // called with (title, amount, type)
      const title = arg1 || "";
      const amount = Number(arg2);
      const type = arg3 || "expense";
      if (isNaN(amount) || amount <= 0) return;
      newTransaction = {
        id: Date.now(),
        title,
        amount,
        type,
        date: new Date().toLocaleString(),
      };
    }

    // prepend newest first
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const addGoal = (name, target) => {
    if (!name || !target) return;
    const g = { id: Date.now(), name, target: Number(target), progress: 0 };
    setGoals((prev) => [g, ...prev]);
  };

  // totals
  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0),
    [transactions]
  );

  // clamp money left to zero (no negative balance shown)
  const moneyLeft = Math.max(budget + totalIncome - totalExpense, 0);

  // update goals progress (simple formula)
  const updatedGoals = goals.map((g) => ({
    ...g,
    progress: Math.min(
      100,
      Math.round(((totalIncome - totalExpense) / (g.target || 1)) * 100)
    ),
  }));

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        addTransaction,
        totalIncome,
        totalExpense,
        moneyLeft,
        budget,
        setBudget,
        goals: updatedGoals,
        addGoal,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
