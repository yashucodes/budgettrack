import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// ----------------------
// Expenses
// ----------------------
export const getExpenses = () => axios.get(`${BASE_URL}/expenses`);
export const addExpense = (expense) => axios.post(`${BASE_URL}/expenses`, expense);

// ----------------------
// Notes (QuickNotes)
// ----------------------
export const getNotes = () => axios.get(`${BASE_URL}/notes`);
export const addNoteAPI = (note) => axios.post(`${BASE_URL}/notes`, note);
export const deleteNoteAPI = (id) => axios.delete(`${BASE_URL}/notes/${id}`);

// ----------------------
// Insights
// ----------------------
export const getInsights = (from, to) =>
  axios.get(`${BASE_URL}/insights`, { params: { from, to } });

// ----------------------
// AI Summary
// ----------------------
export const getAISummary = (prompt) =>
  axios.post(`${BASE_URL}/ai-summary`, { prompt });
