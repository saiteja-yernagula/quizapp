import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://quizapp-1-y0cu.onrender.com/api/token/", form);
      localStorage.setItem("token", res.data.access);

      const profileRes = await axios.get("https://quizapp-1-y0cu.onrender.com/api/profile/", {
        headers: {
          Authorization: `Bearer ${res.data.access}`,
        },
      });

      if (profileRes.data.is_admin) {
        alert("✅ Welcome Admin!");
        navigate("/admindashboard");
      } else {
        alert("❌ Access denied. Not an admin.");
        localStorage.removeItem("token");
      }
    } catch (err) {
      alert("❌ Invalid credentials");
      console.error(err);
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light px-3">
      <motion.div
        className="shadow-lg rounded-4 bg-white p-4 p-md-5 w-100"
        style={{ maxWidth: "420px" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-center text-success fw-bold mb-4">🧑‍💼 Admin Login</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              name="username"
              className="form-control"
              placeholder="Enter username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100 fw-semibold">
            Login
          </button>
        </form>

        <p className="text-center text-muted mt-3 small">
          Not registered? <a href="/admin/register">Create Admin Account</a>
        </p>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
