import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BudgetProvider } from "./context/BudgetContext";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Goals from "./pages/Goals";
import Navbar from "./components/Navbar";
import Insight from "./pages/Insights";

function App() {
  return (
    <BudgetProvider>
      <Router>
        {/* Use the Navbar component */}
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/insights" element={<Insight />} />
        </Routes>
      </Router>
    </BudgetProvider>
  );
}

export default App;
