import React, { useContext } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

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
      expenseByCategory[cat] =
        (expenseByCategory[cat] || 0) + Number(t.amount);
    });

  const pieData = Object.keys(expenseByCategory).map((cat) => ({
    name: cat,
    value: expenseByCategory[cat],
    percent: ((expenseByCategory[cat] / expense) * 100).toFixed(1),
  }));

  const sortedCategories = [...pieData].sort((a, b) => b.value - a.value);

  const COLORS = [
    "#3B82F6",
    "#06B6D4",
    "#F97316",
    "#EF4444",
    "#22C55E",
    "#A855F7",
  ];

  // AI-style insights
  const biggestCategory = sortedCategories[0]?.name || "N/A";
  const biggestSpend = sortedCategories[0]?.value || 0;
  const savingRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;
  const monthlyBurn = expense > 0 ? expense / 30 : 0;
  const daysLeft =
    balance > 0 && monthlyBurn > 0
      ? Math.floor(balance / monthlyBurn)
      : 0;

  const tooltipStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    border: "1px solid #3B82F6",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <Link to="/">
        <button className="bg-blue-600 px-4 py-2 rounded mb-4 hover:bg-blue-700">
          ← Back to Dashboard
        </button>
      </Link>

      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
        💡 Smart AI Insights
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="backdrop-blur bg-white/10 p-6 rounded-2xl shadow">
          <p>💰 Income</p>
          <p className="text-2xl font-bold text-green-400">₹{income}</p>
        </div>
        <div className="backdrop-blur bg-white/10 p-6 rounded-2xl shadow">
          <p>📉 Expense</p>
          <p className="text-2xl font-bold text-red-400">₹{expense}</p>
        </div>
        <div className="backdrop-blur bg-white/10 p-6 rounded-2xl shadow">
          <p>🏦 Balance</p>
          <p
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-cyan-400" : "text-red-500"
            }`}
          >
            {balance >= 0 ? `₹${balance}` : "⚠ Negative"}
          </p>
        </div>
      </div>

      {/* AI Tips */}
      <div className="bg-indigo-900/40 border border-indigo-700/40 p-6 rounded-2xl shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">🔮 AI Financial Tips</h2>
        <ul className="space-y-2">
          {expense > income && (
            <li className="text-red-400">
              ⚠️ You are overspending! Reduce expenses immediately.
            </li>
          )}
          {balance < 1000 && (
            <li className="text-yellow-400">
              ⚠️ Balance is very low — limit spending this week.
            </li>
          )}
          {biggestSpend > 0 && (
            <li className="text-blue-300">
              💡 Most money goes to <b>{biggestCategory}</b> (₹{biggestSpend}).
              Cutting 20% saves ₹{(0.2 * biggestSpend).toFixed(0)}.
            </li>
          )}
          <li className="text-green-300">
            📊 Saving Rate: {savingRate}% — aim for at least 20%.
          </li>
          {daysLeft > 0 && (
            <li className="text-cyan-300">
              ⏳ Balance will last ~{daysLeft} days at current pace.
            </li>
          )}
        </ul>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-slate-900/60 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">
            Spending Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                labelLine={false}
                label={(entry) => `${entry.name} (${entry.percent}%)`}
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={{ color: "#fff" }}
                cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-slate-900/60 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">
            Top Spending Categories
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedCategories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#E5E7EB" />
              <YAxis stroke="#E5E7EB" />
              <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={{ color: "#fff" }}
                cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
              />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Insight;
