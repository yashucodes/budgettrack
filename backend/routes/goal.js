const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

// Get all goals
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

// Create a new goal
router.post("/", async (req, res) => {
  try {
    const { name, target, deadline } = req.body;
    const goal = new Goal({ name, target, deadline });
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: "Failed to save goal" });
  }
});

// Delete a goal
router.delete("/:id", async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete goal" });
  }
});

// Update a goal
router.patch("/:id", async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: "Failed to update goal" });
  }
});

// Export router
module.exports = router;
