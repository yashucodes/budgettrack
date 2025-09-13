import React, { useContext } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

function Insight() {
  const { transactions } = useContext(BudgetContext);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  // Group expenses by category
  const expenseByCategory = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const cat = t.category || t.title || "Other";
      expenseByCategory[cat] = (expenseByCategory[cat] || 0) + Number(t.amount);
    });

  const pieData = Object.keys(expenseByCategory).map((cat) => ({
    name: cat,
    value: expenseByCategory[cat],
  }));

  const COLORS = ["#f87171", "#facc15", "#34d399", "#60a5fa", "#a78bfa"];

  return (
    <div className="p-6">
      <Link to="/">
        <button className="bg-gray-300 px-4 py-2 rounded mb-4 hover:bg-gray-400">
          ← Back to Dashboard
        </button>
      </Link>

      <h1 className="text-3xl font-bold mb-6">💡 AI Insights</h1>

      {/* Summary */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <p>💰 Income: <b className="text-green-700">₹{income}</b></p>
        <p>📉 Expense: <b className="text-red-700">₹{expense}</b></p>
        <p>🏦 Balance: <b>{balance >= 0 ? `₹${balance}` : "⚠️ Negative Balance"}</b></p>
      </div>

      {/* AI Tips */}
      <div className="bg-blue-50 shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">AI Tips</h2>
        {expense > income ? (
          <p className="text-red-700">⚠️ You are overspending! Try cutting expenses.</p>
        ) : (
          <p className="text-green-700">✅ Great job! You are saving more than you spend.</p>
        )}
        {balance < 1000 && (
          <p className="text-red-600">⚠️ Warning: Your balance is running low!</p>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Where Your Money Goes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120} label>
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Insight;
