import React, { useState, useContext } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { Link } from "react-router-dom";

const AddExpense = () => {
  const { transactions, addTransaction, deleteTransaction, editTransaction } = useContext(BudgetContext);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !amount) return alert("Please fill in all fields");

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return alert("Enter valid positive amount");

    const transaction = {
      title: title.trim(),
      amount: numAmount,
      type,
      date: new Date().toISOString()
    };

    if (editingId) {
      editTransaction(editingId, transaction);
      setEditingId(null);
    } else {
      addTransaction(transaction);
    }

    setTitle("");
    setAmount("");
    setType("expense");
  };

  const handleEdit = (t) => {
    setTitle(t.title);
    setAmount(t.amount);
    setType(t.type);
    setEditingId(t._id); // <-- use _id from MongoDB
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
          required
          min="0.01"
          step="0.01"
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded flex-1 text-sm"
          required
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <div>
        {transactions.length === 0 && <p>No transactions yet.</p>}
        {transactions.map((t) => (
          <div key={t._id} className="flex justify-between items-center border p-2 mb-2 rounded">
            <div>
              <span className="font-semibold">{t.title}</span> - ${Number(t.amount).toFixed(2)} ({t.type})
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(t)}
                className="bg-yellow-400 px-2 py-1 rounded text-xs hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTransaction(t._id)}
                className="bg-red-500 px-2 py-1 rounded text-xs text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddExpense;
