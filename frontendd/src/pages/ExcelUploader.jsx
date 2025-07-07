import React, { useState } from "react";
import axios from "axios";

function ExcelUploader() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("⚠️ Please select a file before uploading!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "https://quizapp-1-y0cu.onrender.com/api/admin/upload-excel/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert("✅ Excel uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Upload failed. Please check your file format and try again.");
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-body">
        <h4 className="card-title mb-3">📤 Upload Quiz via Excel</h4>

        {/* Instructions */}
        <div className="alert alert-info">
          <p className="fw-bold mb-2">📝 Excel Format Instructions:</p>
          <ul className="ps-3 mb-2">
            <li><code>quiz_title</code>: Title of the quiz</li>
            <li><code>subject</code>: Subject of the quiz</li>
            <li><code>duration</code>: Duration in minutes (e.g. 2)</li>
            <li><code>question_text</code>: The question text</li>
            <li><code>option_1</code> to <code>option_4</code>: All four options</li>
            <li><code>correct_option</code>: Must be 1, 2, 3, or 4</li>
          </ul>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <small className="text-muted">
              Save as <code>.xlsx</code>. Remove empty rows before uploading.
            </small>
            <a
              href="/quiz_upload_template.xlsx"
              download
              className="btn btn-sm btn-outline-primary"
            >
              📥 Sample File
            </a>
          </div>
        </div>

        {/* Upload Form */}
        <div className="row g-2 align-items-center">
          <div className="col-md-8">
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files[0])}
              className="form-control"
            />
          </div>
          <div className="col-md-4">
            <button onClick={handleUpload} className="btn btn-success w-100">
              🚀 Upload Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExcelUploader;
