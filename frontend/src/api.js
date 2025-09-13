// src/api.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Get all expenses
export const getExpenses = () => axios.get(`${BASE_URL}/expenses`);

// Add a new expense
export const addExpense = (expense) => axios.post(`${BASE_URL}/expenses`, expense);

// Get insights
export const getInsights = (from, to) => 
  axios.get(`${BASE_URL}/insights`, { params: { from, to } });

// Call OpenAI summary
export const getAISummary = (prompt) => 
  axios.post(`${BASE_URL}/ai-summary`, { prompt });

