import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  // Pages that need dark gradient navbar
  const darkPages = ["/goals", "/insights"];
  const navbarClass = darkPages.includes(location.pathname)
    ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white"
    : "bg-gray-100 text-black";

  return (
    <nav className={`${navbarClass} p-4 flex gap-4`}>
      <Link className="hover:underline" to="/">Dashboard</Link>
      <Link className="hover:underline" to="/add-expense">Add Expense</Link>
      <Link className="hover:underline" to="/goals">Goals</Link>
      <Link className="hover:underline" to="/insights">AI Insights</Link>
    </nav>
  );
}

export default Navbar;
