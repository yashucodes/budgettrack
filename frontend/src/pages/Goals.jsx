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
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", target: "", deadline: "" });
  const [saving, setSaving] = useState(false);

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

  const startEdit = (goal) => {
    setEditingId(goal._id);
    setEditData({
      name: goal.name,
      target: goal.target,
      deadline: goal.deadline ? goal.deadline.substring(0, 10) : "",
    });
  };

  const saveEdit = async (id) => {
    if (!editData.name || !editData.target || !editData.deadline) {
      alert("Please fill all fields before saving.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: editData.name,
        target: Number(editData.target),
        deadline: editData.deadline,
      };

      const res = await axios.put(`${API_URL}/${id}`, payload);
      const updatedGoal = res.data;

      setGoals((prev) =>
        prev.map((g) => (g._id === id ? updatedGoal : g))
      );

      setEditingId(null);
      setEditData({ name: "", target: "", deadline: "" });
    } catch (err) {
      console.error("Error updating goal", err);
      alert("Failed to update goal.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", target: "", deadline: "" });
  };

  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const monthlySaving = income - expense;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <Link to="/">
        <button className="bg-blue-600 px-4 py-2 rounded mb-6 hover:bg-blue-700">
          ← Back to Dashboard
        </button>
      </Link>

      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
        🎯 Goals
      </h1>

      {/* Goal Form */}
      <div className="backdrop-blur bg-white/10 p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Set a New Goal</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input type="text" placeholder="Goal Name" value={goalName} onChange={(e) => setGoalName(e.target.value)} className="border p-2 rounded flex-1 bg-slate-800 text-white" />
          <input type="number" placeholder="Target Amount (₹)" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="border p-2 rounded flex-1 bg-slate-800 text-white" />
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="border p-2 rounded flex-1 bg-slate-800 text-white" />
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
          <div key={goal._id} className={`backdrop-blur p-6 rounded-2xl shadow mb-6 ${goal.completed ? "bg-green-900/40 border border-green-700" : "bg-slate-900/60 border border-slate-700"}`}>
            {editingId === goal._id ? (
              <>
                <h2 className="text-xl font-bold mb-4">✏️ Edit Goal</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="border p-2 rounded flex-1 bg-slate-800 text-white" />
                  <input type="number" value={editData.target} onChange={(e) => setEditData({ ...editData, target: e.target.value })} className="border p-2 rounded flex-1 bg-slate-800 text-white" />
                  <input type="date" value={editData.deadline} onChange={(e) => setEditData({ ...editData, deadline: e.target.value })} className="border p-2 rounded flex-1 bg-slate-800 text-white" />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => saveEdit(goal._id)}
                    disabled={saving}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "💾 Save"}
                  </button>
                  <button onClick={cancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">✖ Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4 text-cyan-300">{goal.name}</h2>
                <p>🗓 Months Left: <b>{monthsLeft}</b></p>
                <p>💰 Monthly Saving: <b className="text-green-400">₹{monthlySaving}</b></p>
                <p>📌 Required Per Month: <b className="text-red-400">₹{requiredPerMonth.toFixed(0)}</b></p>
                <p>{canAchieve ? "✅ You can achieve this goal on time!" : "⚠️ Not enough savings."}</p>

                <div className="flex gap-3 mt-4">
                  {!goal.completed && (
                    <button onClick={() => completeGoal(goal._id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                      ✅ Mark Completed
                    </button>
                  )}
                  <button onClick={() => startEdit(goal)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                    ✏️ Edit
                  </button>
                  <button onClick={() => deleteGoal(goal._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    🗑 Delete
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Goals;
