import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

function StudentScoreChart() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/student/results/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const formatted = res.data.map(item => ({
          quiz: item.quiz_title,
          score: item.score,
          total: item.total,
          percentage: item.percentage
        }));

        setData(formatted);
      } catch (err) {
        console.error("Chart fetch error:", err);
      }
    };

    if (token) fetchResults();
  }, [token]);

  return (
    <div className="p-4 bg-white rounded-lg shadow mt-4">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">📊 My Quiz Score Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quiz" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percentage" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StudentScoreChart;
