import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
        {/* Your existing dashboard content, cards, stats etc. */}

        <Link to="/add-expense">
            <button>Add Income/Expense</button>
        </Link>
        </div>
    );
    <div className="grid grid-cols-2 gap-6">
      
      {/* Balance Card */}
      <div className="bg-cyan-100 p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold text-gray-800">💰 Balance</h3>
        <p className="text-2xl font-bold text-gray-900">₹5000</p>
      </div>

      {/* Expenses Card */}
      <div className="bg-red-100 p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold text-gray-800">📉 Total Expenses</h3>
        <p className="text-2xl font-bold text-gray-900">₹2500</p>
      </div>

      {/* Goals Card */}
      <div className="bg-purple-100 p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold text-gray-800">🎯 Goals</h3>
        <p className="text-2xl font-bold text-gray-900">Laptop: 40% complete</p>
      </div>

      {/* Insights Card */}
      <div className="bg-yellow-100 p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold text-gray-800">💡 Insights</h3>
        <p className="text-md text-gray-700">⚠️ You spent 50% on Food last week.</p>
      </div>

    </div>
  );
}

export default Dashboard;
