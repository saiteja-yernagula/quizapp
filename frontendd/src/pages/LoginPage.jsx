import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://quizapp-1-y0cu.onrender.com/api/token/', {
        username,
        password,
      });

      localStorage.setItem("token", response.data.access);
      toast.success("Login successful! 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid username or password 😢");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px', borderRadius: '1rem' }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold text-primary">🔐 Login to Quiz Portal</h3>
          <p className="text-muted">Access your quizzes and results</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            🚀 Login
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="text-muted">Don't have an account?</span>
          <br />
          <Link to="/register" className="btn btn-link text-decoration-none fw-semibold">
            👉 Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
