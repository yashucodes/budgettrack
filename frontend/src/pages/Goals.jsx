import React, { useContext, useState } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Goals() {
  const { transactions } = useContext(BudgetContext);

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  // Calculate income, expense, savings
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlySaving = income - expense;

  // Months left until deadline
  const monthsLeft =
    deadline !== ""
      ? Math.max(
          1,
          Math.ceil(
            (new Date(deadline).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24 * 30)
          )
        )
      : 0;

  const requiredPerMonth =
    targetAmount && monthsLeft > 0 ? targetAmount / monthsLeft : 0;

  const canAchieve =
    monthlySaving >= requiredPerMonth && targetAmount > 0 ? true : false;

  // Graph data
  const chartData = [
    { name: "You Save / Month", value: monthlySaving },
    { name: "Required / Month", value: requiredPerMonth },
  ];

  return (
    <div className="p-6">
      <Link to="/">
        <button className="bg-gray-300 px-4 py-2 rounded mb-4 hover:bg-gray-400 transition">
          ← Back to Dashboard
        </button>
      </Link>

      <h1 className="text-3xl font-bold mb-6">🎯 Goals</h1>

      {/* Goal Form */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Set Your Goal</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Goal (e.g., Trip to Goa)"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <input
            type="number"
            placeholder="Target Amount (₹)"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border p-2 rounded flex-1"
          />
        </div>
      </div>

      {/* Goal Analysis */}
      {goalName && targetAmount > 0 && (
        <div className="bg-blue-50 shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">{goalName} Analysis</h2>
          <p className="mb-2">🗓 Months Left: <b>{monthsLeft}</b></p>
          <p className="mb-2">💰 Monthly Saving: <b className="text-green-700">₹{monthlySaving}</b></p>
          <p className="mb-2">📌 Required Per Month: <b className="text-red-700">₹{requiredPerMonth.toFixed(0)}</b></p>

          <p className="mb-4">
            {canAchieve ? (
              <span className="text-green-700 font-bold">
                ✅ You can achieve this goal on time!
              </span>
            ) : (
              <span className="text-red-700 font-bold">
                ⚠️ Savings not enough. Cut expenses or extend deadline.
              </span>
            )}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-6 mb-6">
            <div
              className={`h-6 rounded-full ${
                canAchieve ? "bg-green-500" : "bg-red-500"
              }`}
              style={{
                width: `${
                  Math.min((monthlySaving / requiredPerMonth) * 100, 100) || 0
                }%`,
              }}
            ></div>
          </div>

          {/* Bar Chart */}
          <h3 className="text-lg font-semibold mb-2">Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Goals;
