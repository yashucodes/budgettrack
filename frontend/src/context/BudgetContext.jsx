// src/context/BudgetContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const BudgetContext = createContext();

const API_URL = "http://localhost:5000/api/transactions";

export const BudgetProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // Fetch all transactions from backend on load
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(API_URL);
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (transaction) => {
    try {
      const res = await axios.post(API_URL, transaction);
      setTransactions(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to add transaction:", err);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  const editTransaction = async (id, updatedTransaction) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updatedTransaction);
      setTransactions(prev => prev.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Failed to update transaction:", err);
    }
  };

  return (
    <BudgetContext.Provider value={{ transactions, addTransaction, deleteTransaction, editTransaction }}>
      {children}
    </BudgetContext.Provider>
  );
};
