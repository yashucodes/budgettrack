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
const path = require('path');             // For serving static files
const OpenAI = require('openai'); // OpenAI SDK

// ----------------------
// Configure OpenAI
// ----------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Your OpenAI key from .env
});

// ----------------------
// Create Express app
// ----------------------
const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(cors());           // Enable cross-origin requests
app.use(express.json()); 
  // Parse incoming JSON bodies automatically
// Protects against common HTTP vulnerabilities
const helmet = require("helmet");
app.use(helmet());

// ----------------------
// Connect to MongoDB
// ----------------------
const uri = process.env.MONGO_URI; // MongoDB connection string stored in .env
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Full error:', err);
  });

// ----------------------
// Load the Expense model
// ----------------------
const Expense = require('./models/Expense'); // Represents the "expenses" collection

// ----------------------
// Serve static files from React build
// ----------------------
// Serve static files from the React app build folder
app.use(express.static(path.join(__dirname, '../frontend/build')));

// ----------------------
// API Routes
// ----------------------
app.use('/api/expenses', require('./routes/expenses')); // Route for expense CRUD
app.use("/api/goals", require("./routes/goal")); // Route for goals CRUD

// ----------------------
// Root route for testing MongoDB connection
// ----------------------
app.get('/', async (req, res) => {
  try {
    const count = await Expense.countDocuments(); // Count expenses in MongoDB
    res.send(`<h1>MongoDB is working!</h1><p>There are ${count} expenses in the database.</p>`);
  } catch (err) {
    res.send(`<h1>Error connecting to MongoDB</h1><p>${err.message}</p>`);
  }
});

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

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    res.json({ result: response.choices[0].message.content });

  } catch (err) {
    console.error('OpenAI error', err);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

// ----------------------
// Catch-all handler: send back React's index.html file for any non-API routes
// ----------------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// ----------------------
// Error Handling
// ----------------------
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:');
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Full error:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:');
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Stack trace:', err.stack);
});

// ----------------------
// Start the server
// ----------------------
const PORT = process.env.PORT || 5000;

// Keep the process alive
const keepAlive = () => {
  setInterval(() => {}, 1000);
};

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/expenses    (Create expense)');
  console.log('- GET  /api/expenses    (List expenses)');
  console.log('- GET  /api/insights    (Get spending insights)');
  console.log('- POST /api/ai-summary  (Get AI analysis)');
  keepAlive();
});

// Prevent premature shutdown
process.stdin.resume();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close()
      .then(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
      })
      .catch(err => {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      });
  });
});
