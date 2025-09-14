import React, { useContext, useState } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { Link } from "react-router-dom";

function AddExpense() {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    moneyLeft,
  } = useContext(BudgetContext);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [editingId, setEditingId] = useState(null);

  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const numericAmount = Math.abs(parseFloat(amount));
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    const payload = {
      title,
      amount: numericAmount,
      type,
      date: new Date(),
    };

    try {
      if (editingId) {
        await updateTransaction(editingId, payload);
        setEditingId(null);
      } else {
        await addTransaction(payload);
      }
      setTitle("");
      setAmount("");
      setType("income");
    } catch (err) {
      alert("Could not save transaction. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
    } catch (err) {
      alert("Could not delete. See console for details.");
    }
  };

  const handleEdit = (t) => {
    setTitle(t.title);
    setAmount(t.amount);
    setType(t.type);
    setEditingId(t._id || t.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      {/* Back button */}
      <Link to="/">
        <button className="bg-blue-600 px-4 py-2 rounded mb-6 hover:bg-blue-700">
          ← Back to Dashboard
        </button>
      </Link>

      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
        {editingId ? "✏️ Edit Transaction" : "➕ Add Transaction"}
      </h1>

      {/* Form */}
      <div className="backdrop-blur bg-white/10 p-6 rounded-2xl shadow mb-10">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded flex-1 bg-slate-800 text-white"
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded flex-1 bg-slate-800 text-white"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded flex-1 bg-slate-800 text-white"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingId ? "💾 Update" : "➕ Add"}
          </button>
        </form>

        <div className="mb-4 text-lg font-semibold text-cyan-300">
          💵 Money Left: ₹{Math.max(moneyLeft, 0)}
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income */}
        <div className="backdrop-blur bg-slate-900/60 border border-green-700 p-4 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4 text-green-400">Income</h2>
          <table className="w-full text-sm">
            <thead className="text-green-300 border-b border-green-700">
              <tr>
                <th className="px-2 py-1 text-left">Amount (₹)</th>
                <th className="px-2 py-1 text-left">Title</th>
                <th className="px-2 py-1 text-left">Date</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomeTransactions.map((t) => (
                <tr
                  key={t._id || t.id}
                  className={`hover:bg-green-800/40 ${
                    editingId === (t._id || t.id) ? "bg-yellow-900/40" : ""
                  }`}
                >
                  <td className="px-2 py-1 font-medium text-green-300">₹{t.amount}</td>
                  <td className="px-2 py-1">{t.title}</td>
                  <td className="px-2 py-1">{new Date(t.date).toLocaleString()}</td>
                  <td className="px-2 py-1 flex gap-2">
                    <button
                      onClick={() => handleEdit(t)}
                      className="bg-yellow-500 px-2 py-1 rounded text-xs hover:bg-yellow-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(t._id || t.id)}
                      className="bg-red-600 px-2 py-1 rounded text-xs hover:bg-red-700"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="font-bold text-green-300">
                <td className="px-2 py-1">₹{totalIncome}</td>
                <td className="px-2 py-1">Total</td>
                <td className="px-2 py-1">—</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Expense */}
        <div className="backdrop-blur bg-slate-900/60 border border-red-700 p-4 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4 text-red-400">Expense</h2>
          <table className="w-full text-sm">
            <thead className="text-red-300 border-b border-red-700">
              <tr>
                <th className="px-2 py-1 text-left">Amount (₹)</th>
                <th className="px-2 py-1 text-left">Title</th>
                <th className="px-2 py-1 text-left">Date</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenseTransactions.map((t) => (
                <tr
                  key={t._id || t.id}
                  className={`hover:bg-red-800/40 ${
                    editingId === (t._id || t.id) ? "bg-yellow-900/40" : ""
                  }`}
                >
                  <td className="px-2 py-1 font-medium text-red-300">₹{t.amount}</td>
                  <td className="px-2 py-1">{t.title}</td>
                  <td className="px-2 py-1">{new Date(t.date).toLocaleString()}</td>
                  <td className="px-2 py-1 flex gap-2">
                    <button
                      onClick={() => handleEdit(t)}
                      className="bg-yellow-500 px-2 py-1 rounded text-xs hover:bg-yellow-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(t._id || t.id)}
                      className="bg-red-600 px-2 py-1 rounded text-xs hover:bg-red-700"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="font-bold text-red-300">
                <td className="px-2 py-1">₹{totalExpense}</td>
                <td className="px-2 py-1">Total</td>
                <td className="px-2 py-1">—</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;
