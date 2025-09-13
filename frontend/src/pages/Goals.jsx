import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { Link } from "react-router-dom";

function Goals() {
  const { transactions } = useContext(BudgetContext);

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [goals, setGoals] = useState([]);
  const [notes, setNotes] = useState("");

  const API_URL = "http://localhost:5000/api/goals";

  // fetch goals on load
  useEffect(() => {
    axios.get(API_URL)
      .then(res => setGoals(res.data))
      .catch(err => console.error(err));
  }, []);

  const addGoal = async () => {
    if (goalName && targetAmount > 0 && deadline) {
      try {
        const res = await axios.post(API_URL, {
          name: goalName,
          target: targetAmount,
          deadline,
        });
        setGoals([res.data, ...goals]);
        setGoalName("");
        setTargetAmount("");
        setDeadline("");
      } catch (err) {
        console.error("Error saving goal", err);
      }
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setGoals(goals.filter(g => g._id !== id));
    } catch (err) {
      console.error("Error deleting goal", err);
    }
  };

  const completeGoal = async (id) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}/complete`);
      setGoals(goals.map(g => g._id === id ? res.data : g));
    } catch (err) {
      console.error("Error completing goal", err);
    }
  };

  // income/expense for analysis
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const monthlySaving = income - expense;

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
        <h2 className="text-xl font-semibold mb-4">Set a New Goal</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input type="text" placeholder="Goal Name" value={goalName} onChange={(e) => setGoalName(e.target.value)} className="border p-2 rounded flex-1" />
          <input type="number" placeholder="Target Amount (₹)" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="border p-2 rounded flex-1" />
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="border p-2 rounded flex-1" />
        </div>
        <button onClick={addGoal} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">➕ Add Goal</button>
      </div>

      {/* Goals List */}
      {goals.map((goal) => {
        const monthsLeft = Math.max(
          1,
          Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))
        );
        const requiredPerMonth = goal.target / monthsLeft;
        const canAchieve = monthlySaving >= requiredPerMonth;

        return (
          <div key={goal._id} className={`shadow-md rounded-2xl p-6 mb-6 ${goal.completed ? "bg-green-100" : "bg-blue-50"}`}>
            <h2 className="text-xl font-bold mb-4">{goal.name}</h2>
            <p>🗓 Months Left: <b>{monthsLeft}</b></p>
            <p>💰 Monthly Saving: <b className="text-green-700">₹{monthlySaving}</b></p>
            <p>📌 Required Per Month: <b className="text-red-700">₹{requiredPerMonth.toFixed(0)}</b></p>
            <p>{canAchieve ? "✅ You can achieve this goal on time!" : "⚠️ Not enough savings."}</p>

            <div className="flex gap-3 mt-4">
              {!goal.completed && (
                <button onClick={() => completeGoal(goal._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  ✅ Mark Completed
                </button>
              )}
              <button onClick={() => deleteGoal(goal._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                🗑 Delete
              </button>
            </div>
          </div>
        );
      })}

      {/* Notes */}
      <div className="bg-white shadow-md rounded-2xl p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">📝 Notes</h2>
        <textarea placeholder="Write your thoughts..." value={notes} onChange={(e) => setNotes(e.target.value)} className="border p-3 rounded w-full h-32" />
      </div>
    </div>
  );
}

export default Goals;
