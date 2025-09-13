import React, { useState } from "react";

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

  return (
    <div>
      <h1>Add Transaction</h1>

      <form onSubmit={handleAddTransaction}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit">Add Transaction</button>
      </form>

      <h2>Income</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {incomeTransactions.map(t => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>₹{t.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Expense</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {expenseTransactions.map(t => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>₹{t.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddExpense;
