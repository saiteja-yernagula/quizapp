// src/components/Navbar.jsx or Sidebar.jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex gap-4">
      <Link to="/dashboard">🏠 Dashboard</Link>
      <Link to="/results">📊 Results</Link> {/* 👈 Link to main result dashboard */}
    </nav>
  );
}

export default Navbar;
