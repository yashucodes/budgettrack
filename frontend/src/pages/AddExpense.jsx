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
  const [editingId, setEditingId] = useState(null); // _id from backend or fallback id

  // Separate income and expense
  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

  // Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const numericAmount = Math.abs(parseFloat(amount));
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    const payload = {
      title,
      amount: numericAmount,
      type,
      date: new Date().toLocaleString(),
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
      // error already logged in context; show user friendly message
      alert("Could not save transaction. Check console for details.");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
    } catch (err) {
      alert("Could not delete. See console for details.");
    }
  };

  // Begin edit
  const handleEdit = (t) => {
    setTitle(t.title);
    setAmount(t.amount);
    setType(t.type);
    setEditingId(t._id || t.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6">
      <Link to="/">
        <button className="bg-gray-300 px-3 py-1 rounded mb-4 hover:bg-gray-400 text-sm">
          ← Back
        </button>
      </Link>

      <h1 className="text-xl font-bold mb-4">{editingId ? "Edit Transaction" : "Add Transaction"}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 mb-6">
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
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded text-sm">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <div className="mb-4 text-lg font-semibold">💵 Money Left: ₹{Math.max(moneyLeft, 0)}</div>

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
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomeTransactions.map((t) => (
                <tr key={t._id || t.id} className={`hover:bg-green-50 ${editingId === (t._id || t.id) ? "bg-yellow-100" : ""}`}>
                  <td className="px-2 py-1 font-medium">₹{t.amount}</td>
                  <td className="px-2 py-1">{t.title}</td>
                  <td className="px-2 py-1">{new Date(t.date).toLocaleString()}</td>
                  <td className="px-2 py-1 flex gap-2">
                    <button onClick={() => handleEdit(t)} className="bg-yellow-400 px-2 py-1 rounded text-xs hover:bg-yellow-500">✏️ Edit</button>
                    <button onClick={() => handleDelete(t._id || t.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">🗑️ Delete</button>
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-green-200">
                <td className="px-2 py-1">₹{totalIncome}</td>
                <td className="px-2 py-1">Total</td>
                <td className="px-2 py-1">—</td>
                <td></td>
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
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenseTransactions.map((t) => (
                <tr key={t._id || t.id} className={`hover:bg-red-50 ${editingId === (t._id || t.id) ? "bg-yellow-100" : ""}`}>
                  <td className="px-2 py-1 font-medium">₹{t.amount}</td>
                  <td className="px-2 py-1">{t.title}</td>
                  <td className="px-2 py-1">{new Date(t.date).toLocaleString()}</td>
                  <td className="px-2 py-1 flex gap-2">
                    <button onClick={() => handleEdit(t)} className="bg-yellow-400 px-2 py-1 rounded text-xs hover:bg-yellow-500">✏️ Edit</button>
                    <button onClick={() => handleDelete(t._id || t.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">🗑️ Delete</button>
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-red-200">
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
