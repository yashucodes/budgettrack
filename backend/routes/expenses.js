// Import Express framework
const express = require('express');

// Create a router object to define routes for expenses
const router = express.Router();

// Import the Expense model to interact with the MongoDB collection
const Expense = require('../models/Expense');

// ----------------------
// Route: Create a new expense
// ----------------------
router.post('/', async (req, res) => {
  try {
    // Extract data sent by the client (frontend) in the request body
    const { amount, category, note, date } = req.body;

    // Create a new Expense document using the data
    const e = new Expense({ amount, category, note, date });

    // Save the expense to MongoDB
    await e.save();

    // Send back the saved expense as JSON
    res.json(e);

  } catch (err) {
    // If something goes wrong, return an error with status 500
    res.status(500).json({ error: 'create failed' });
  }
});

// ----------------------
// Route: Get all expenses
// Method: GET /api/expenses
// ----------------------
router.get('/', async (req, res) => {
  try {
    // Fetch expenses from MongoDB, sorted by newest first, limit to 100
    const expenses = await Expense.find().sort({ date: -1 }).limit(100);

    // Send the list of expenses back to the client
    res.json(expenses);

  } catch (err) {
    // Return error if fetching fails
    res.status(500).json({ error: 'fetch failed' });
  }
});

// Export the router so server.js can use these routes
module.exports = router;
