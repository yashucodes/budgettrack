import React, { useContext, useState } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { Link } from "react-router-dom";

function AddExpense() {
  const { transactions, addTransaction, moneyLeft } = useContext(BudgetContext);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    addTransaction(title, amount, type);
    setTitle("");
    setAmount("");
    setType("income");
  };

  return (
    <div className="p-6">
      <Link to="/">
        <button className="bg-gray-300 px-4 py-2 rounded mb-4 hover:bg-gray-400">
          ← Back to Dashboard
        </button>
      </Link>

      <h1 className="text-2xl font-bold mb-4">Add Transaction</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-2 mb-6"
      >
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      <div className="mb-4 text-xl font-semibold">
        💵 Money Left: ₹{moneyLeft || 0}
      </div>

      <h2 className="text-xl font-bold mb-2">Transactions</h2>
      <table className="w-full border border-gray-200 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{t.title}</td>
              <td className="px-4 py-2">₹{t.amount}</td>
              <td className="px-4 py-2">{t.type}</td>
              <td className="px-4 py-2">{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddExpense;
