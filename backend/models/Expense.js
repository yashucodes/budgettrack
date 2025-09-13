// Import Mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// Define a schema for an Expense
// A schema is like a blueprint for how each expense document should look in the database
const ExpenseSchema = new mongoose.Schema({
  amount: { 
    type: Number,        // Amount of money spent
    required: true       // This field must be filled; cannot be empty
  },
  category: { 
    type: String,        // Category of the expense (e.g., Food, Transport)
    required: true       // Must be provided
  },
  note: { 
    type: String         // Optional note or description for the expense
  },
  date: { 
    type: Date,          // Date of the expense
    default: Date.now    // If no date is provided, use current date/time
  },
});

// Export the model so it can be used elsewhere in the project
// 'Expense' is the model name, ExpenseSchema defines its structure
module.exports = mongoose.model('Expense', ExpenseSchema);
