import React, { useContext, useState } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { Link } from "react-router-dom";
import { addExpense } from "../api";

function AddExpense() {
  const { transactions, addTransaction, moneyLeft } = useContext(BudgetContext);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  const totalIncome = incomeTransactions.reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = expenseTransactions.reduce((s, t) => s + Number(t.amount), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericAmount = Math.abs(Number(amount));
    if (!title || isNaN(numericAmount) || numericAmount <= 0) return;

    // Prepare expense object
    const tx = {
      title: title.trim(),
      amount: numericAmount,
      type,
      date: new Date(),
    };

    try {
      // Save to MongoDB via backend
      const res = await addExpense(tx);

      // Update local context state
      addTransaction(res.data);

      // Reset form
      setTitle("");
      setAmount("");
      setType("income");
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  return (
    <div className="p-6">
      <Link to="/">
        <button className="bg-gray-300 px-3 py-1 rounded mb-4 hover:bg-gray-400 text-sm">
          ← Back
        </button>
      </Link>

      <h1 className="text-xl font-bold mb-3">Add Transaction</h1>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-32 text-sm"
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded flex-1 text-sm"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded text-sm"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
        >
          Add
        </button>
      </form>

      <div className="mb-4 text-lg font-semibold">💵 Money Left: ₹{moneyLeft}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Table */}
        <div>
          <h2 className="text-lg font-bold mb-2 text-green-700">Income</h2>
          <table className="w-full border border-gray-200 rounded text-sm">
            <thead className="bg-green-100">
              <tr>
                <th className="px-2 py-1">Amount (₹)</th>
                <th className="px-2 py-1">Title</th>
                <th className="px-2 py-1">Date</th>
              </tr>
            </thead>
            <tbody>
              {incomeTransactions.length === 0 ? (
                <tr>
                  <td className="px-2 py-1" colSpan="3">No income yet</td>
                </tr>
              ) : (
                incomeTransactions.map((t) => (
                  <tr key={t._id || t.id} className="hover:bg-green-50">
                    <td className="px-2 py-1 font-medium">₹{t.amount}</td>
                    <td className="px-2 py-1">{t.title}</td>
                    <td className="px-2 py-1">
                      {new Date(t.date).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
              <tr className="font-bold bg-green-200">
                <td className="px-2 py-1">₹{totalIncome}</td>
                <td className="px-2 py-1">Total</td>
                <td className="px-2 py-1">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Expense Table */}
        <div>
          <h2 className="text-lg font-bold mb-2 text-red-700">Expense</h2>
          <table className="w-full border border-gray-200 rounded text-sm">
            <thead className="bg-red-100">
              <tr>
                <th className="px-2 py-1">Amount (₹)</th>
                <th className="px-2 py-1">Title</th>
                <th className="px-2 py-1">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenseTransactions.length === 0 ? (
                <tr>
                  <td className="px-2 py-1" colSpan="3">No expenses yet</td>
                </tr>
              ) : (
                expenseTransactions.map((t) => (
                  <tr key={t._id || t.id} className="hover:bg-red-50">
                    <td className="px-2 py-1 font-medium">₹{t.amount}</td>
                    <td className="px-2 py-1">{t.title}</td>
                    <td className="px-2 py-1">
                      {new Date(t.date).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
              <tr className="font-bold bg-red-200">
                <td className="px-2 py-1">₹{totalExpense}</td>
                <td className="px-2 py-1">Total</td>
                <td className="px-2 py-1">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;
