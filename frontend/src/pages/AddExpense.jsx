import React, { useState } from "react";
import { Link } from "react-router-dom";

function AddExpense() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newTransaction = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      type,
    };

    setTransactions([...transactions, newTransaction]);
    setTitle("");
    setAmount("");
    setType("income");
  };

  // Separate income and expense
  const incomeTransactions = transactions.filter(t => t.type === "income");
  const expenseTransactions = transactions.filter(t => t.type === "expense");

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6">
      {/* Back to Dashboard */}
      <Link to="/">
        <button className="bg-gray-300 px-4 py-2 rounded mb-4 hover:bg-gray-400 transition">
          ← Back to Dashboard
        </button>
      </Link>

      {/* Add Transaction Form */}
      <h1 className="text-2xl font-bold mb-4">Add Transaction</h1>
      <form onSubmit={handleAddTransaction} className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-32"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add
        </button>
      </form>

      {/* Income and Expense Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Table */}
        <div>
          <h2 className="text-xl font-bold mb-2 text-green-700">Income</h2>
          <table className="w-full border border-gray-200 rounded overflow-hidden">
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {incomeTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-green-50">
                  <td className="px-4 py-2">{t.title}</td>
                  <td className="px-4 py-2">₹{t.amount}</td>
                </tr>
              ))}
              <tr className="font-bold bg-green-200">
                <td className="px-4 py-2">Total</td>
                <td className="px-4 py-2">₹{totalIncome}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Expense Table */}
        <div>
          <h2 className="text-xl font-bold mb-2 text-red-700">Expense</h2>
          <table className="w-full border border-gray-200 rounded overflow-hidden">
            <thead className="bg-red-100">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {expenseTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-red-50">
                  <td className="px-4 py-2">{t.title}</td>
                  <td className="px-4 py-2">₹{t.amount}</td>
                </tr>
              ))}
              <tr className="font-bold bg-red-200">
                <td className="px-4 py-2">Total</td>
                <td className="px-4 py-2">₹{totalExpense}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;
