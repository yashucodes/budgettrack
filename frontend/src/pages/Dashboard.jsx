import React, { useContext } from "react";
import { BudgetContext } from "../context/BudgetContext";

function Dashboard() {
  const {
    totalIncome,
    totalExpense,
    moneyLeft,
    goals,
  } = useContext(BudgetContext);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cyan-100 p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold">💰 Total Income</h3>
          <p className="text-2xl font-bold">₹{totalIncome || 0}</p>
        </div>

        <div className="bg-red-100 p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold">📉 Total Expenses</h3>
          <p className="text-2xl font-bold">₹{totalExpense || 0}</p>
        </div>

        <div className="bg-green-100 p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold">💵 Money Left</h3>
          <p className="text-2xl font-bold">₹{moneyLeft || 0}</p>
        </div>

        <div className="bg-purple-100 p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold">🎯 Goals</h3>
          {goals.length === 0 ? (
            <p>No goals set yet</p>
          ) : (
            goals.map((g) => (
              <div key={g.id} className="mb-2">
                <p>{g.name}</p>
                <div className="bg-gray-200 w-full h-4 rounded">
                  <div
                    className="bg-green-500 h-4 rounded text-white text-xs text-center"
                    style={{ width: `${g.progress}%` }}
                  >
                    {g.progress}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
