import React, { useContext, useState } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { Link } from "react-router-dom";

function Goals() {
  const { goals, addGoal } = useContext(BudgetContext);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !target) return;
    addGoal(name, target);
    setName("");
    setTarget("");
  };

  return (
    <div className="p-6">
      <Link to="/">
        <button className="bg-gray-300 px-4 py-2 rounded mb-4 hover:bg-gray-400">
          ← Back to Dashboard
        </button>
      </Link>

      <h1 className="text-2xl font-bold mb-4">Set Your Goal</h1>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Goal Name (e.g., Trip)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="number"
          placeholder="Target Amount"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="border p-2 rounded w-32"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Add Goal
        </button>
      </form>

      {goals.length === 0 ? (
        <p>No goals yet</p>
      ) : (
        goals.map((g) => (
          <div key={g.id} className="mb-4">
            <p className="font-semibold">{g.name}</p>
            <div className="bg-gray-200 w-full h-4 rounded">
              <div
                className="bg-purple-500 h-4 rounded text-white text-xs text-center"
                style={{ width: `${g.progress}%` }}
              >
                {g.progress}%
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Goals;
