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
  CartesianGrid
} from "recharts";

function Dashboard() {
  const { transactions, moneyLeft } = useContext(BudgetContext);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Group expenses by category/title for Pie Chart
  const expenseData = [];
  transactions.forEach((t) => {
    if (t.type === "expense") {
      const existing = expenseData.find((e) => e.name === t.title);
      if (existing) {
        existing.value += Number(t.amount);
      } else {
        expenseData.push({ name: t.title, value: Number(t.amount) });
      }
    }
  });

  // Line chart data (date vs amount spent)
  const lineData = transactions.map((t) => ({
    date: new Date(t.date).toLocaleDateString(),
    expense: t.type === "expense" ? Number(t.amount) : 0,
    income: t.type === "income" ? Number(t.amount) : 0,
  }));

  const COLORS = ["#FF8042", "#00C49F", "#0088FE", "#FFBB28", "#AA336A"];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Income</h2>
          <p className="text-2xl font-bold text-green-700">₹{income}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Expense</h2>
          <p className="text-2xl font-bold text-red-700">₹{expense}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Balance</h2>
          <p className="text-2xl font-bold text-blue-700">₹{moneyLeft}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Goal Progress</h2>
          <p className="text-xl text-yellow-700">Coming Soon 🎯</p>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart for Spending */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-bold mb-4">Spending by Category</h2>
          {expenseData.length > 0 ? (
            <PieChart width={300} height={300}>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <p className="text-gray-500">No expenses yet.</p>
          )}
        </div>

        {/* Line Chart for Spending Trend */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-bold mb-4">Spending Trend</h2>
          {lineData.length > 0 ? (
            <LineChart width={400} height={300} data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="expense" stroke="#FF0000" />
              <Line type="monotone" dataKey="income" stroke="#00C49F" />
            </LineChart>
          ) : (
            <p className="text-gray-500">No transactions yet.</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Link to="/add-expense">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            + Add Transaction
          </button>
        </Link>
      </div>

      {/* Quick Notes */}
      <QuickNotes />
    </div>
  );
}

export default Dashboard;
