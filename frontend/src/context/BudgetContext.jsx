import React, { createContext, useState, useEffect, useMemo } from "react";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getNotes,
  addNoteAPI,
  deleteNoteAPI,
} from "../api";

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [goals, setGoals] = useState([]);
  const [notes, setNotes] = useState([]);

  // Load transactions from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getExpenses();
        // assume res.data is array of expense objects with _id
        setTransactions(
          res.data.map((t) => ({
            ...t,
            // ensure amount is number
            amount: Number(t.amount),
          }))
        );
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };
    fetchData();
  }, []);

  // Load notes from backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await getNotes();
        setNotes(res.data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
    };
    fetchNotes();
  }, []);

  // Add transaction (saves to backend and updates state)
  const addTransaction = async (t) => {
    const payload = {
      title: t.title || "",
      amount: Number(t.amount),
      type: t.type || "expense",
      date: t.date || new Date(),
    };

    try {
      const res = await addExpense(payload); // backend returns saved object with _id
      setTransactions((prev) => [{ ...res.data, amount: Number(res.data.amount) }, ...prev]);
    } catch (err) {
      console.error("Failed to add transaction:", err);
      // fallback: optimistic add locally (no _id)
      setTransactions((prev) => [{ ...payload, _id: Date.now().toString() }, ...prev]);
    }
  };

  // Update transaction (PUT) — returns updated transaction in res.data
  const updateTransaction = async (id, updated) => {
    try {
      const res = await updateExpense(id, updated);
      setTransactions((prev) =>
        prev.map((t) => ((t._id || t.id) === id ? { ...res.data, amount: Number(res.data.amount) } : t))
      );
      return res.data;
    } catch (err) {
      console.error("Failed to update transaction:", err);
      // fallback: update locally
      setTransactions((prev) =>
        prev.map((t) => ((t._id || t.id) === id ? { ...t, ...updated } : t))
      );
      throw err;
    }
  };

  // Delete transaction (DELETE)
  const deleteTransaction = async (id) => {
    try {
      await deleteExpense(id);
      setTransactions((prev) => prev.filter((t) => (t._id || t.id) !== id));
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      // fallback: remove locally
      setTransactions((prev) => prev.filter((t) => (t._id || t.id) !== id));
      throw err;
    }
  };

  // Notes functions
  const addNote = async (note) => {
    try {
      const res = await addNoteAPI(note);
      setNotes((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to add note:", err);
      setNotes((prev) => [{ ...note, _id: Date.now().toString() }, ...prev]);
    }
  };

  const deleteNote = async (id) => {
    try {
      await deleteNoteAPI(id);
      setNotes((prev) => prev.filter((n) => (n._id || n.id) !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
      setNotes((prev) => prev.filter((n) => (n._id || n.id) !== id));
    }
  };

  // Goals
  const addGoal = (name, target) => {
    if (!name || !target) return;
    const g = { id: Date.now(), name, target: Number(target), progress: 0 };
    setGoals((prev) => [g, ...prev]);
  };

  // Totals
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
    progress: Math.min(100, Math.round(((totalIncome - totalExpense) / (g.target || 1)) * 100)),
  }));

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        totalIncome,
        totalExpense,
        moneyLeft,
        budget,
        setBudget,
        goals: updatedGoals,
        addGoal,
        notes,
        addNote,
        deleteNote,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
