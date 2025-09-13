// ----------------------
// Load environment variables
// ----------------------
// This allows us to use sensitive info like MongoDB URI and OpenAI API key
require('dotenv').config();

// ----------------------
// Import required libraries
// ----------------------
const express = require('express');       // Web framework for API/server
const mongoose = require('mongoose');     // MongoDB connection and models
const cors = require('cors');             // Allows frontend to talk to backend
const { Configuration, OpenAIApi } = require('openai'); // OpenAI SDK

// ----------------------
// Configure OpenAI
// ----------------------
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI key from .env
});
const openai = new OpenAIApi(configuration);

// ----------------------
// Create Express app
// ----------------------
const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(cors());           // Enable cross-origin requests
app.use(express.json());   // Parse incoming JSON bodies automatically

// ----------------------
// Connect to MongoDB
// ----------------------
const uri = process.env.MONGO_URI; // MongoDB connection string stored in .env
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))       // Success
  .catch(err => console.error('MongoDB error', err)); // Failure

// ----------------------
// Load the Expense model
// ----------------------
const Expense = require('./models/Expense'); // Represents the "expenses" collection

// ----------------------
// API Routes
// ----------------------
app.use('/api/expenses', require('./routes/expenses')); // Route for expense CRUD

// ----------------------
// Insights endpoint
// ----------------------
app.get('/api/insights', async (req, res) => {
  try {
    // Determine date range from query params or default to all time
    const from = req.query.from ? new Date(req.query.from) : new Date(0);
    const to = req.query.to ? new Date(req.query.to) : new Date();

    // Get all expenses in that date range
    const expenses = await Expense.find({ date: { $gte: from, $lte: to } });

    // Calculate totals
    const totals = {};
    let total = 0;
    expenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
      total += e.amount;
    });

    // Build simple suggestions/messages
    const messages = [];
    for (let cat in totals) {
      const pct = ((totals[cat] / total) * 100).toFixed(0);
      if (pct > 30) {
        messages.push(`You spent ${pct}% on ${cat} — consider reducing this to save more.`);
      }
    }
    if (messages.length === 0) messages.push('Spending looks balanced this period.');

    // Send response
    res.json({ total, totals, messages });

  } catch (err) {
    res.status(500).json({ error: 'insights error' });
  }
});

// ----------------------
//  Example OpenAI endpoint
// ----------------------
app.post('/api/ai-summary', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    res.json({ result: response.data.choices[0].message.content });

  } catch (err) {
    console.error('OpenAI error', err);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

// ----------------------
// Start the server
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on', PORT));
