import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AdminRegister() {
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://quizapp-1-y0cu.onrender.com/api/admin/register/", {
        ...form,
        is_admin: true,
      });
      alert("✅ Admin registered successfully!");
      navigate("/admin/login");
    } catch (err) {
      alert("❌ Registration failed. Check console.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen d-flex justify-content-center align-items-center bg-light px-3">
      <motion.div
        className="shadow-lg rounded-4 bg-white p-4 p-md-5 w-100"
        style={{ maxWidth: "420px" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-center text-primary fw-bold mb-4">
          🧑‍💼 Admin Register
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              name="username"
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter username"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Create password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center text-muted mt-3 small">
          Already an admin? <a href="/admin/login">Login here</a>
        </p>
      </motion.div>
    </div>
  );
}

export default AdminRegister;
