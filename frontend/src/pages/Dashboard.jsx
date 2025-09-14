import React, { useContext } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { Link } from "react-router-dom";
import QuickNotes from "../components/QuickNotes";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

function Dashboard() {
  const { transactions, moneyLeft } = useContext(BudgetContext);

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Income vs Expense Ratio
  const ratioData = [
    { name: "Spent", value: expense },
    { name: "Saved", value: Math.max(income - expense, 0) },
  ];

  const ratioColors = ["#EF4444", "#22C55E"]; // red for spent, green for saved

  // Weekly Expense Distribution
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyData = weekdays.map(day => ({
    day,
    expense: transactions
      .filter(t => t.type === "expense")
      .filter(t => new Date(t.date).getDay() === weekdays.indexOf(day))
      .reduce((sum, t) => sum + Number(t.amount), 0)
  }));

  // AI Insights generation
  const insights = [];
  const savedAmount = income - expense;
  const savingRate = income ? ((savedAmount / income) * 100).toFixed(1) : 0;

  if (income === 0) {
    insights.push("⚠️ No income recorded. Add income to track savings effectively.");
  } else {
    insights.push(`💰 You saved ₹${savedAmount} this period (${savingRate}% of your income).`);
  }

  if (expense > income) {
    insights.push("⚠️ You are spending more than you earn. Consider reducing expenses!");
  }

  // Highest and lowest spending days
  const maxExpense = Math.max(...weeklyData.map(d => d.expense));
  const minExpense = Math.min(...weeklyData.map(d => d.expense));
  const maxDay = weeklyData.find(d => d.expense === maxExpense)?.day;
  const minDay = weeklyData.find(d => d.expense === minExpense)?.day;

  if (maxExpense > 0) {
    insights.push(`📅 Highest spending was on ${maxDay} with ₹${maxExpense}.`);
  }
  if (minExpense > 0) {
    insights.push(`📉 Lowest spending was on ${minDay} with ₹${minExpense}.`);
  }

  // Combined high-spending days compared to average daily income
  const avgDailyIncome = income / 7;
  const highSpendingDays = weeklyData
    .filter(day => day.expense > avgDailyIncome * 0.8)
    .map(day => day.day);

  if (highSpendingDays.length > 0) {
    insights.push(`⚠️ Spending is high on these days compared to average daily income: ${highSpendingDays.join(", ")}.`);
  }

  const tooltipStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    border: "1px solid #3B82F6",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
        📊 Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="backdrop-blur bg-white/10 p-6 rounded-2xl shadow text-center">
          <h2 className="text-lg font-semibold">Income</h2>
          <p className="text-2xl font-bold text-green-400">₹{income}</p>
        </div>
        <div className="backdrop-blur bg-white/10 p-6 rounded-2xl shadow text-center">
          <h2 className="text-lg font-semibold">Expense</h2>
          <p className="text-2xl font-bold text-red-400">₹{expense}</p>
        </div>
        <div className="backdrop-blur bg-white/10 p-6 rounded-2xl shadow text-center">
          <h2 className="text-lg font-semibold">Balance</h2>
          <p className="text-2xl font-bold text-cyan-400">₹{moneyLeft}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Income vs Expense Pie Chart */}
        <div className="bg-slate-900/60 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">Income vs Expense</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ratioData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name} (${((entry.value / income) * 100).toFixed(1)}%)`}
              >
                {ratioData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={ratioColors[index % ratioColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#fff" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Expense Bar Chart */}
        <div className="bg-slate-900/60 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">Weekly Expense Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#E5E7EB" />
              <YAxis stroke="#E5E7EB" />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#fff" }} cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} />
              <Bar dataKey="expense" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="backdrop-blur bg-indigo-900/40 border border-indigo-700/40 p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">💡 AI Insights</h2>
        <ul className="space-y-2">
          {insights.map((insight, idx) => (
            <li key={idx}>{insight}</li>
          ))}
        </ul>
      </div>

      {/* Quick Notes */}
      <QuickNotes customClass="backdrop-blur bg-slate-900/50 p-4 rounded-2xl shadow mb-6" />

      {/* Add Expense Button */}
      <div>
        <Link to="/add-expense">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            + Add Transaction
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
