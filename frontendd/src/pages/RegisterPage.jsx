import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('users/register/', { username, password });

      toast.success('✅ Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error("Registration Error:", error);
      if (error.response && error.response.data?.error === "Username already exists") {
        toast.error('⚠️ Username already exists!');
      } else {
        toast.error('❌ Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px', borderRadius: '1rem' }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold text-success">📝 Register for Quiz Portal</h3>
          <p className="text-muted">Create your account to get started</p>
        </div>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            ✅ Register
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="text-muted">Already have an account?</span>
          <br />
          <Link to="/login" className="btn btn-link text-decoration-none fw-semibold">
            🔐 Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
