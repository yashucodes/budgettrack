const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

// Get all goals
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error("Error fetching goals:", err);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

// Create a new goal
router.post("/", async (req, res) => {
  try {
    const { name, target, deadline } = req.body;
    const goal = new Goal({
      name,
      target: Number(target),
      deadline: deadline ? new Date(deadline) : null,
    });
    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error("Error saving goal:", err);
    res.status(500).json({ error: "Failed to save goal" });
  }
});

// Delete a goal
router.delete("/:id", async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: "Goal deleted" });
  } catch (err) {
    console.error("Error deleting goal:", err);
    res.status(500).json({ error: "Failed to delete goal" });
  }
});

// Full update (used by Save/Edit)
router.put("/:id", async (req, res) => {
  try {
    const { name, target, deadline, completed } = req.body;

    const updates = {};
    if (typeof name !== "undefined") updates.name = name;
    if (typeof target !== "undefined") updates.target = Number(target);
    if (typeof deadline !== "undefined") updates.deadline = new Date(deadline);
    if (typeof completed !== "undefined") updates.completed = completed;

    const goal = await Goal.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    res.json(goal);
  } catch (err) {
    console.error("Error updating goal:", err);
    res.status(500).json({ error: "Failed to update goal" });
  }
});

// Partial update (generic PATCH)
router.patch("/:id", async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    res.json(goal);
  } catch (err) {
    console.error("Error patching goal:", err);
    res.status(500).json({ error: "Failed to patch goal" });
  }
});

// Mark a goal as completed
router.patch("/:id/complete", async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    res.json(goal);
  } catch (err) {
    console.error("Error marking goal completed:", err);
    res.status(500).json({ error: "Failed to mark goal completed" });
  }
});

module.exports = router;
