import React, { createContext, useState, useEffect, useMemo } from "react";
import { getExpenses, addExpense, getNotes, addNoteAPI, deleteNoteAPI } from "../api";

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [goals, setGoals] = useState([]);
  const [notes, setNotes] = useState([]);

  // -----------------------
  // Load transactions
  // -----------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getExpenses();
        setTransactions(
          res.data.map((t) => ({
            id: t._id,
            title: t.title,
            amount: Number(t.amount),
            type: t.type,
            date: t.date,
          }))
        );
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };
    fetchData();
  }, []);

  // -----------------------
  // Load notes
  // -----------------------
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

  // -----------------------
  // Transactions
  // -----------------------
  const addTransaction = async (t) => {
    const newTransaction = {
      id: t.id || Date.now(),
      title: t.title || "",
      amount: Number(t.amount),
      type: t.type || "expense",
      date: t.date || new Date().toLocaleString(),
    };

    try {
      const res = await addExpense(newTransaction);
      setTransactions((prev) => [
        { id: res.data._id, ...res.data },
        ...prev,
      ]);
    } catch (err) {
      console.error("Failed to add transaction:", err);
      setTransactions((prev) => [newTransaction, ...prev]); // fallback
    }
  };

  // -----------------------
  // Notes
  // -----------------------
  const addNote = async (note) => {
    try {
      const res = await addNoteAPI(note);
      setNotes((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to add note:", err);
      setNotes((prev) => [note, ...prev]);
    }
  };

  const deleteNote = async (id) => {
    try {
      await deleteNoteAPI(id);
      setNotes((prev) => prev.filter((n) => n._id !== id && n.id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  // -----------------------
  // Goals
  // -----------------------
  const addGoal = (name, target) => {
    if (!name || !target) return;
    const g = { id: Date.now(), name, target: Number(target), progress: 0 };
    setGoals((prev) => [g, ...prev]);
  };

  // -----------------------
  // Totals
  // -----------------------
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
        notes,
        addNote,
        deleteNote,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
export default BudgetContext;