import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

function AdminResults() {
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get("https://quizapp-1-y0cu.onrender.com/api/admin/results/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResults(res.data);
      } catch (err) {
        console.error("Admin results fetch error:", err);
      }
    };

    fetchResults();
  }, []);

  const exportToCSV = () => {
    const csv = results.map(r =>
      `${r.username},${r.quiz_title},${r.score},${r.percentage},${r.passed}`
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "results.csv";
    link.click();
  };

  // ---------- 📊 DATA PREP FOR VISUALIZATIONS ----------
  const quizAverages = {};
  const studentScores = {};
  const passFail = { pass: 0, fail: 0 };
  const timelineData = [];

  results.forEach(r => {
    // Quiz Average
    if (!quizAverages[r.quiz_title]) quizAverages[r.quiz_title] = [];
    quizAverages[r.quiz_title].push(r.percentage);

    // Student Comparison
    if (!studentScores[r.username]) studentScores[r.username] = 0;
    studentScores[r.username] += r.percentage;

    // Pass/Fail
    r.passed ? passFail.pass++ : passFail.fail++;

    // Timeline
    if (r.submitted_at) {
      const date = new Date(r.submitted_at).toLocaleDateString();
      const existing = timelineData.find(d => d.date === date);
      if (existing) {
        existing.count++;
      } else {
        timelineData.push({ date, count: 1 });
      }
    }
  });

  const quizData = Object.entries(quizAverages).map(([quiz, scores]) => ({
    quiz,
    avg: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
  }));

  const studentData = Object.entries(studentScores).map(([user, total]) => ({
    user,
    total: parseFloat((total).toFixed(2))
  }));

  const pieData = [
    { name: "Pass", value: passFail.pass },
    { name: "Fail", value: passFail.fail }
  ];

  const COLORS = ["#4CAF50", "#F44336"];

 return (
  <div className="container py-4">
    <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <h2 className="fw-bold">🧑‍💼 Admin - All Quiz Results</h2>
      <button
        onClick={exportToCSV}
        className="btn btn-success"
      >
        📥 Export CSV
      </button>
    </div>

    {/* 🧾 TABULAR VIEW */}
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h4 className="card-title mb-3">📄 All Results</h4>
        {results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Quiz</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i}>
                    <td>{r.username}</td>
                    <td>{r.quiz_title}</td>
                    <td>{r.score}</td>
                    <td>{r.percentage}%</td>
                    <td className={r.passed ? "text-success" : "text-danger"}>
                      {r.passed ? "✅ Passed" : "❌ Failed"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

    {/* 📊 QUIZ-WISE AVERAGE */}
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h4 className="card-title mb-3">📊 Quiz-wise Average</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={quizData}>
            <XAxis dataKey="quiz" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avg" fill="#8884d8" name="Average %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* 🧑‍🎓 STUDENT-WISE COMPARISON */}
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h4 className="card-title mb-3">🧑‍🎓 Student-wise Comparison</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={studentData}>
            <XAxis dataKey="user" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#82ca9d" name="Total %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* ✅❌ PASS vs FAIL */}
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h4 className="card-title mb-3">✅❌ Pass vs Fail</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

}

export default AdminResults;
