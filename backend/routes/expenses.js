const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// CREATE new expense
router.post("/", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const saved = await expense.save();
    res.json(saved);
  } catch (err) {
    console.error("Error saving expense:", err);
    res.status(500).json({ error: "Failed to save expense" });
  }
});

// READ all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// UPDATE expense by id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Expense not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

// DELETE expense by id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense deleted", id: deleted._id });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

module.exports = router;
