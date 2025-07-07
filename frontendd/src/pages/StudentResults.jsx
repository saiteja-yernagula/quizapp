import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import StudentScoreChart from "./StudentScoreChart";

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/student/results/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data);
      } catch (err) {
        console.error("❌ Error fetching results:", err);
      }
    };

    if (token) fetchResults();
  }, [token]);

  return (
    <div className="container py-5 px-3">
      <motion.h2
        className="text-center text-primary fw-bold mb-5 display-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        📊 My Quiz Results
      </motion.h2>

      {results.length === 0 ? (
        <motion.p
          className="text-center text-muted fs-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No quiz attempts found yet.
        </motion.p>
      ) : (
        <div className="row g-4">
          {results.map((result) => (
            <motion.div
              key={result.id}
              className="col-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="card shadow-lg border-0 h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title fw-bold text-primary mb-2">
                      {result.quiz_title}
                    </h5>
                    <p className="text-secondary small mb-1">
                      👤 {result.username}
                    </p>
                    <p className="mb-1">
                      <strong>Score:</strong> {result.score} / {result.total}
                    </p>
                    <p className="mb-1">
                      <strong>Percentage:</strong>{" "}
                      <span
                        className={
                          result.percentage >= 50
                            ? "text-success fw-bold"
                            : "text-danger fw-bold"
                        }
                      >
                        {result.percentage}%
                      </span>
                    </p>
                    <p className="mb-2">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge px-3 py-2 ${
                          result.passed ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {result.passed ? "Passed ✅" : "Failed ❌"}
                      </span>
                    </p>

                    {result.submitted_at && (
                      <p className="text-muted small mb-0">
                        🕒{" "}
                        {new Date(result.submitted_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    )}
                  </div>

                 
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        className="mt-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <StudentScoreChart />
      </motion.div>
    </div>
  );
};

export default StudentResults;
