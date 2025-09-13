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

  const incomeTransactions = transactions.filter(t => t.type === "income");
  const expenseTransactions = transactions.filter(t => t.type === "expense");

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6">
      <Link to="/">
        <button className="bg-gray-300 px-4 py-2 rounded mb-4">← Back to Dashboard</button>
      </Link>

      <h1 className="text-2xl font-bold mb-4">Add Transaction</h1>

      <form onSubmit={handleAddTransaction} className="flex gap-2 mb-6">
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
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      <div className="grid grid-cols-2 gap-6">
        {/* Income Table */}
        <div>
          <h2 className="text-xl font-bold mb-2">Income</h2>
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border px-2 py-1">Title</th>
                <th className="border px-2 py-1">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {incomeTransactions.map(t => (
                <tr key={t.id}>
                  <td className="border px-2 py-1">{t.title}</td>
                  <td className="border px-2 py-1">₹{t.amount}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="border px-2 py-1">Total</td>
                <td className="border px-2 py-1">₹{totalIncome}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Expense Table */}
        <div>
          <h2 className="text-xl font-bold mb-2">Expense</h2>
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border px-2 py-1">Title</th>
                <th className="border px-2 py-1">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {expenseTransactions.map(t => (
                <tr key={t.id}>
                  <td className="border px-2 py-1">{t.title}</td>
                  <td className="border px-2 py-1">₹{t.amount}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="border px-2 py-1">Total</td>
                <td className="border px-2 py-1">₹{totalExpense}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;
