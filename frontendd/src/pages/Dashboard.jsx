import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("https://quizapp-1-y0cu.onrender.com/api/quizzes/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setQuizzes(res.data.results || res.data);
      })
      .catch(err => {
        console.error(err);
        toast.error("❌ Failed to load quizzes");
      });
  }, []);

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary mb-3 mb-md-0">
          🎯 Welcome to Your Dashboard
        </h2>
        <div className="d-flex gap-2">
          <Link to="/results/student" className="btn btn-outline-primary">
            📈 View Results
          </Link>
          <Link to="/logout" className="btn btn-outline-danger">
            🚪 Logout
          </Link>
        </div>
      </div>

      {/* Quiz Grid */}
      {quizzes.length === 0 ? (
        <div className="text-center text-muted py-5">
          <h4>No quizzes available right now 💤</h4>
        </div>
      ) : (
        <div className="row g-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-dark fw-semibold mb-2">{quiz.title}</h5>
                  <ul className="list-unstyled text-muted small mb-3">
                    <li><strong>Subject:</strong> {quiz.subject}</li>
                    <li><strong>Duration:</strong> {quiz.duration} mins</li>
                    <li>
                      <strong>Status:</strong>{" "}
                      {quiz.is_published ? (
                        <span className="text-success fw-semibold">Published ✅</span>
                      ) : (
                        <span className="text-danger fw-semibold">Draft ❌</span>
                      )}
                    </li>
                  </ul>
                  <button
                    className={`btn btn-${quiz.is_published ? 'primary' : 'secondary'} mt-auto`}
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                    disabled={!quiz.is_published}
                  >
                    {quiz.is_published ? "🚀 Start Quiz" : "Not Available"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
