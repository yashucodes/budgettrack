import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getExpenses, getInsights } from "../api";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [insights, setInsights] = useState("Loading insights...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load expenses and insights when component mounts
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get expenses from backend
      const expensesResponse = await getExpenses();
      setExpenses(expensesResponse.data);

      // Get insights from backend
      const insightsResponse = await getInsights();
      if (insightsResponse.data.messages && insightsResponse.data.messages.length > 0) {
        setInsights(insightsResponse.data.messages[0]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setInsights("⚠️ Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals from actual data
  const totalExpenses = expenses
    .filter(e => e.amount > 0)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalIncome = Math.abs(expenses
    .filter(e => e.amount < 0)
    .reduce((sum, e) => sum + e.amount, 0));
  
  const balance = totalIncome - totalExpenses;

  // You can implement goals feature later
  const goals = "Set your savings goal";

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Header and Add button */}
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <Link to="/add-expense">
        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-6">
          Add Income/Expense
        </button>
      </Link>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Balance Card */}
        <div className="bg-cyan-100 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800">💰 Balance</h3>
          <p className="text-2xl font-bold text-gray-900">₹{balance.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">Total Income: ₹{totalIncome.toFixed(2)}</p>
        </div>

        {/* Expenses Card */}
        <div className="bg-red-100 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800">📉 Total Expenses</h3>
          <p className="text-2xl font-bold text-gray-900">₹{totalExpenses.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">{expenses.filter(e => e.amount > 0).length} transactions</p>
        </div>

        {/* Recent Transactions */}
        <div className="bg-purple-100 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800">🕒 Recent Activity</h3>
          <div className="mt-2 space-y-2">
            {expenses.slice(0, 3).map(e => (
              <div key={e._id} className="text-sm">
                <span className={e.amount > 0 ? "text-red-600" : "text-green-600"}>
                  {e.amount > 0 ? "-" : "+"} ₹{Math.abs(e.amount)}
                </span>
                {" "}- {e.category}
              </div>
            ))}
          </div>
        </div>

        {/* Insights Card */}
        <div className="bg-yellow-100 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-800">💡 Insights</h3>
          <p className="text-md text-gray-700">{insights}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
