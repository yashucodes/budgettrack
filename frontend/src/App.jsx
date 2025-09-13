import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { BudgetProvider } from "./context/BudgetContext";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Goals from "./pages/Goals";
import Insight from "./pages/Insights"; // <- updated import

function App() {
  return (
    <BudgetProvider>
      <Router>
        <nav className="bg-gray-100 p-4 flex gap-4">
          <Link className="hover:underline" to="/">Dashboard</Link>
          <Link className="hover:underline" to="/add-expense">Add Expense</Link>
          <Link className="hover:underline" to="/goals">Goals</Link>
          <Link className="hover:underline" to="/insights">AI Insights</Link> {/* URL path */}
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/insights" element={<Insight />} /> {/* updated path */}
        </Routes>
      </Router>
    </BudgetProvider>
  );
}

export default App;