import React, { createContext, useState } from "react";

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budget, setBudget] = useState(0);

  const addTransaction = (title, amount, type) => {
    const newTransaction = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      type,
      date: new Date().toLocaleString(),
    };
    setTransactions([...transactions, newTransaction]);
  };

  const addGoal = (name, target) => {
    const newGoal = {
      id: Date.now(),
      name,
      target: parseFloat(target),
      progress: 0,
    };
    setGoals([...goals, newGoal]);
  };

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const moneyLeft = budget + totalIncome - totalExpense;

  // Update goals progress
  const updatedGoals = goals.map((g) => ({
    ...g,
    progress: Math.min(
      Math.round(((totalIncome - totalExpense) / g.target) * 100),
      100
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
