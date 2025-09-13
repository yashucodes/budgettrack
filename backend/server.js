// Load environment variables from .env file (like your MongoDB connection string)
require('dotenv').config();

// Import required libraries
const express = require('express');   // Web framework for building API/server
const mongoose = require('mongoose'); // For connecting to MongoDB and defining models
const cors = require('cors');         // Allows your frontend (React) to talk to this backend

// Create an Express app
const app = express();

// Middleware
app.use(cors());             // Enable CORS so frontend can make requests
app.use(express.json());     // Automatically parse JSON in request bodies

// ----------------------
// Connect to MongoDB
// ----------------------
const uri = process.env.MONGO_URI; // MongoDB connection string stored in .env
mongoose.connect(uri, { 
  useNewUrlParser: true,          // Use modern URL parser
  useUnifiedTopology: true        // Use modern server discovery engine
})
  .then(() => console.log('MongoDB connected'))       // Success message
  .catch(err => console.error('MongoDB error', err)); // Error message if connection fails

// ----------------------
// Load the Expense model
// ----------------------
const Expense = require('./models/Expense'); // Represents the "expenses" collection in MongoDB

// ----------------------
// Set up API routes
// ----------------------
app.use('/api/expenses', require('./routes/expenses')); // All /api/expenses requests go to routes/expenses.js

// ----------------------
// Insights endpoint
// ----------------------
// Example: GET /api/insights?from=2025-01-01&to=2025-09-01
// Returns total spending and category suggestions
app.get('/api/insights', async (req, res) => {
  try {
    // Determine the date range (default: all time)
    const from = req.query.from ? new Date(req.query.from) : new Date(0);
    const to = req.query.to ? new Date(req.query.to) : new Date();

    // Get all expenses in the date range
    const expenses = await Expense.find({ date: { $gte: from, $lte: to } });

    // Compute totals per category and overall total
    const totals = {};
    let total = 0;
    expenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
      total += e.amount;
    });

    // Build simple suggestions/messages based on spending patterns
    const messages = [];
    for (let cat in totals) {
      const pct = ((totals[cat] / total) * 100).toFixed(0); // Calculate % of total
      if (pct > 30) {
        messages.push(`You spent ${pct}% on ${cat} — consider reducing this to save more.`);
      }
    }

    if (messages.length === 0) {
      messages.push('Spending looks balanced this period.');
    }

    // Send response
    res.json({ total, totals, messages });

  } catch (err) {
    // If something goes wrong, send error message
    res.status(500).json({ error: 'insights error' });
  }
});

// ----------------------
// Start the server
// ----------------------
const PORT = process.env.PORT || 5000;  // Use PORT from .env or default 5000
app.listen(PORT, () => console.log('Server running on', PORT)); // Confirm server is running
