import React, { useContext } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { Link } from "react-router-dom";

function Insight() {
  const { totalIncome, totalExpense } = useContext(BudgetContext);

  let insightMessage = "No transactions yet.";
  if (totalIncome > totalExpense)
    insightMessage = "Great! You are saving money 💰";
  else if (totalIncome === totalExpense)
    insightMessage = "Break-even. Watch your spending ⚖️";
  else if (totalIncome < totalExpense)
    insightMessage = "Warning! You are overspending ⚠️";

  return (
    <div className="p-6">
      <Link to="/">
        <button className="bg-gray-300 px-4 py-2 rounded mb-4 hover:bg-gray-400">
          ← Back to Dashboard
        </button>
      </Link>

      <h1 className="text-2xl font-bold mb-4">AI Insights</h1>
      <div className="bg-yellow-100 p-6 rounded shadow text-lg font-semibold">
        {insightMessage}
      </div>
    </div>
  );
}

export default Insight;
