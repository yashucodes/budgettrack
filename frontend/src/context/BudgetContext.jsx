// src/context/BudgetContext.js
import React, { createContext, useState, useMemo, useEffect } from "react";
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

  // ---------------------- Fetch Data on Mount ----------------------
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getExpenses();
        const data = res.data || [];
        setTransactions(
          data.map((t) => ({
            ...t,
            amount: Number(t.amount),
            date: t.date
              ? new Date(t.date).toISOString()
              : new Date().toISOString(),
          }))
        );
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };

    const fetchNotes = async () => {
      try {
        const res = await getNotes();
        setNotes(res.data || []);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
    };

    fetchExpenses();
    fetchNotes();
  }, []);

  // ---------------------- Transactions ----------------------
  const addTransaction = async (t) => {
    const payload = {
      title: t.title || "",
      amount: Number(t.amount),
      type: t.type || "expense",
      date: t.date || new Date(),
    };

    try {
      const res = await addExpense(payload);
      const saved = res.data || payload;
      setTransactions((prev) => [
        {
          ...saved,
          amount: Number(saved.amount),
          date: saved.date
            ? new Date(saved.date).toISOString()
            : new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Failed to add transaction:", err);
      setTransactions((prev) => [
        {
          ...payload,
          _id: Date.now().toString(),
          date: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const updateTransaction = async (id, updated) => {
    const payload = {
      ...updated,
      amount: Number(updated.amount),
      date: updated.date || new Date(),
    };

    try {
      const res = await updateExpense(id, payload);
      const saved = res.data || payload;
      setTransactions((prev) =>
        prev.map((t) =>
          (t._id || t.id) === id
            ? {
                ...saved,
                amount: Number(saved.amount),
                date: saved.date
                  ? new Date(saved.date).toISOString()
                  : new Date().toISOString(),
              }
            : t
        )
      );
      return saved;
    } catch (err) {
      console.error("Failed to update transaction:", err);
      setTransactions((prev) =>
        prev.map((t) =>
          (t._id || t.id) === id
            ? { ...t, ...payload, date: new Date().toISOString() }
            : t
        )
      );
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteExpense(id);
      setTransactions((prev) =>
        prev.filter((t) => (t._id || t.id) !== id)
      );
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      setTransactions((prev) =>
        prev.filter((t) => (t._id || t.id) !== id)
      );
    }
  };

  // ---------------------- Notes ----------------------
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

  // ---------------------- Goals ----------------------
  const addGoal = (name, target) => {
    if (!name || !target) return;
    const g = { id: Date.now(), name, target: Number(target), progress: 0 };
    setGoals((prev) => [g, ...prev]);
  };

  // ---------------------- Totals ----------------------
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

  const moneyLeft = Math.max(
    Number(budget) + totalIncome - totalExpense,
    0
  );

  const updatedGoals = goals.map((g) => ({
    ...g,
    progress: Math.min(
      100,
      Math.round(((totalIncome - totalExpense) / (g.target || 1)) * 100)
    ),
  }));

  // ---------------------- Context Value ----------------------
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
