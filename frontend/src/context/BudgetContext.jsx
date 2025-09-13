import React, { createContext, useState, useMemo, useEffect } from "react";
import { getExpenses, addExpense } from "../api"; // ✅ import backend API calls

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budget, setBudget] = useState(0);

  // ✅ Load transactions from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getExpenses();
        // backend returns array of expenses
        setTransactions(
          res.data.map((exp) => ({
            id: exp._id,
            title: exp.title || exp.category || "",
            amount: Number(exp.amount),
            type: exp.type || "expense",
            date: exp.date || new Date().toLocaleString(),
          }))
        );
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };

    fetchData();
  }, []);

  /**
   * addTransaction supports:
   *  - addTransaction({ title, amount, type, date, id })
   *  - addTransaction(title, amount, type)
   */
  const addTransaction = async (arg1, arg2, arg3) => {
    let newTransaction;

    if (typeof arg1 === "object" && arg1 !== null && "amount" in arg1) {
      newTransaction = {
        id: arg1.id || Date.now(),
        title: arg1.title || arg1.category || "",
        amount: Number(arg1.amount),
        type: arg1.type || "expense",
        date: arg1.date || new Date().toLocaleString(),
      };
    } else {
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

    try {
      // ✅ Save to backend
      const res = await addExpense(newTransaction);
      const saved = res.data;

      // ✅ Use backend _id
      setTransactions((prev) => [
        {
          id: saved._id,
          title: saved.title,
          amount: Number(saved.amount),
          type: saved.type,
          date: saved.date || new Date().toLocaleString(),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Error adding expense:", err);
      // fallback: still add locally
      setTransactions((prev) => [newTransaction, ...prev]);
    }
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

  const moneyLeft = Math.max(budget + totalIncome - totalExpense, 0);

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
