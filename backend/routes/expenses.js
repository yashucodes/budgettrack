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

module.exports = router;
