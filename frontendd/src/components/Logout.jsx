import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    alert("🔒 You have been logged out!");
    navigate("/"); // Redirect to homepage
  }, [navigate]);

  return null; // No UI needed
}

export default Logout;