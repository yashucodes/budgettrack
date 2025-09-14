import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-4 flex gap-4">
      <Link className="hover:underline" to="/">Dashboard</Link>
      <Link className="hover:underline" to="/add-expense">Add Expense</Link>
      <Link className="hover:underline" to="/goals">Goals</Link>
      <Link className="hover:underline" to="/insights">AI Insights</Link>
    </nav>
  );
}

export default Navbar;
