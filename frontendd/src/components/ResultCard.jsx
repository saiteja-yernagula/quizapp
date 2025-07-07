// src/components/ResultCard.jsx

import React from "react";

function ResultCard({ result }) {
  const {
    quiz_title,
    student_name,
    score,
    total,
    percentage,
    passed,
    attempted_at,
  } = result;

  return (
    <div className={`p-4 rounded shadow-md border mb-4 ${passed ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        📝 {quiz_title}
      </h3>
      {student_name && (
        <p className="text-sm text-gray-600">👤 Student: <b>{student_name}</b></p>
      )}
      <p className="text-sm text-gray-700">📊 Score: {score} / {total}</p>
      <p className="text-sm text-gray-700">🎯 Percentage: {percentage}%</p>
      <p className="text-sm">
        {passed ? "✅ Passed" : "❌ Failed"}
      </p>
      <p className="text-xs text-gray-500 mt-1">🕒 Attempted: {new Date(attempted_at).toLocaleString()}</p>
    </div>
  );
}

export default ResultCard;
