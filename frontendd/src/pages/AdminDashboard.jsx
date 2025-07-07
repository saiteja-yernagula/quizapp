import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ExcelUploader from './ExcelUploader';
import { Link } from "react-router-dom";


const AdminDashboard = () => {
  // Form data state for quiz details, including questions
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    duration: 5,
    start_time: "", // ISO string format: "YYYY-MM-DDTHH:MM"
    end_time: "",
    is_published: false,
    questions: [
      { 
        text: "", 
        options: [{ text: "", is_correct: false }] 
      },
    ],
  });

  const [editMode, setEditMode] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [quizList, setQuizList] = useState([]);
  const token = localStorage.getItem("token");

  // Helper: Format current date/time for datetime-local (YYYY-MM-DDTHH:MM)
  const getFormattedNow = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  // Set default start_time and end_time on mount
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      start_time: getFormattedNow(),
      end_time: getFormattedNow(),
    }));
    fetchQuizzes();
  }, []);

  // Fetch the list of quizzes from backend
  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/quizzes/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizList(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch quizzes");
      console.error(err);
    }
  };

  // Handle generic input change for top-level fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox change for is_published
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Add a new question to the quiz
  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { text: "", options: [{ text: "", is_correct: false }] },
      ],
    }));
  };

  // Add a new option to a question
  const addOption = (qIndex) => {
    const updatedQuestions = formData.questions.map((q, index) => {
      if (index === qIndex) {
        return {
          ...q,
          options: [...q.options, { text: "", is_correct: false }],
        };
      }
      return q;
    });
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  // Update question text
  const handleQuestionTextChange = (qIndex, value) => {
    const updatedQuestions = formData.questions.map((q, index) =>
      index === qIndex ? { ...q, text: value } : q
    );
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  // Update option text
  const handleOptionTextChange = (qIndex, oIndex, value) => {
    const updatedQuestions = formData.questions.map((q, qi) => {
      if (qi === qIndex) {
        const updatedOptions = q.options.map((opt, oi) =>
          oi === oIndex ? { ...opt, text: value } : opt
        );
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  // Mark one option as correct within a question
  const markCorrectOption = (qIndex, oIndex) => {
    const updatedQuestions = formData.questions.map((q, qi) => {
      if (qi === qIndex) {
        const updatedOptions = q.options.map((opt, oi) => ({
          ...opt,
          is_correct: oi === oIndex,
        }));
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  // Reset the form state to initial values
  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      duration: 5,
      start_time: getFormattedNow(),
      end_time: getFormattedNow(),
      is_published: false,
      questions: [{ text: "", options: [{ text: "", is_correct: false }] }],
    });
    setEditMode(false);
    setEditingQuizId(null);
  };

  // Handle form submit for creating or updating a quiz
  const handleSubmit = async () => {
    // Prepare the payload (duration is ensured as a number)
    const payload = {
      ...formData,
      duration: parseInt(formData.duration, 10),
    };

    try {
      if (editMode && editingQuizId) {
        await axios.put(
          `http://localhost:8000/api/admin/quizzes/${editingQuizId}/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("✅ Quiz updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/admin/quizzes/", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("✅ Quiz created successfully!");
      }
      resetForm();
      fetchQuizzes();
    } catch (err) {
      toast.error("❌ Failed to submit quiz");
      console.error(err);
    }
  };

  // Handle deleting a quiz
  const handleDelete = async (id) => {
    if (!id) return toast.error("❌ Quiz ID not found for delete");
    try {
      await axios.delete(`http://localhost:8000/api/admin/quizzes/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Quiz deleted");
      fetchQuizzes();
    } catch (err) {
      toast.error("❌ Failed to delete quiz");
      console.error(err);
    }
  };

  // Handle editing a quiz: populate the form with its data
  const handleEdit = (quiz) => {
    if (!quiz?.id) return toast.error("❌ Quiz ID missing");
    setEditMode(true);
    setEditingQuizId(quiz.id);
    setFormData({
      title: quiz.title,
      subject: quiz.subject,
      duration: quiz.duration,
      start_time: new Date(quiz.start_time).toISOString().slice(0, 16),
      end_time: new Date(quiz.end_time).toISOString().slice(0, 16),
      is_published: quiz.is_published,
      questions: quiz.questions && quiz.questions.length
        ? quiz.questions
        : [{ text: "", options: [{ text: "", is_correct: false }] }],
    });
  };

return (
  <div className="container py-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>{editMode ? "✏️ Update Quiz" : "🛠️ Create a New Quiz"}</h2>
      <div>
        <Link to="/results/admin" className="btn btn-outline-info me-2">📊 Admin Results</Link>
        <Link to="/logout" className="btn btn-outline-danger">Logout</Link>
      </div>
    </div>

    <div className="mb-4">
      <ExcelUploader />
    </div>

    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h4 className="card-title mb-3">📝 Quiz Details</h4>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Quiz Title</label>
            <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Subject</label>
            <input type="text" name="subject" className="form-control" value={formData.subject} onChange={handleInputChange} />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Duration (minutes)</label>
            <input type="number" name="duration" className="form-control" value={formData.duration} onChange={handleInputChange} />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Start Time</label>
            <input type="datetime-local" name="start_time" className="form-control" value={formData.start_time} onChange={handleInputChange} />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">End Time</label>
            <input type="datetime-local" name="end_time" className="form-control" value={formData.end_time} onChange={handleInputChange} />
          </div>
          <div className="col-12 mb-3 form-check form-switch">
            <input className="form-check-input" type="checkbox" name="is_published" checked={formData.is_published} onChange={handleCheckboxChange} />
            <label className="form-check-label">Publish Quiz</label>
          </div>
        </div>
      </div>
    </div>

    {/* Questions Section */}
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h4 className="card-title">📚 Questions</h4>
        {formData.questions.map((q, qIndex) => (
          <div key={qIndex} className="border rounded p-3 mb-4">
            <label className="form-label">Question {qIndex + 1}</label>
            <input
              type="text"
              className="form-control mb-2"
              value={q.text}
              onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
            />
            {q.options.map((opt, oIndex) => (
              <div className="input-group mb-2" key={oIndex}>
                <input
                  type="text"
                  className="form-control"
                  value={opt.text}
                  onChange={(e) => handleOptionTextChange(qIndex, oIndex, e.target.value)}
                />
                <div className="input-group-text">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={opt.is_correct}
                    onChange={() => markCorrectOption(qIndex, oIndex)}
                  />
                  <span className="ms-2">Correct</span>
                </div>
              </div>
            ))}
            <button className="btn btn-outline-secondary btn-sm" onClick={() => addOption(qIndex)}>
              ➕ Add Option
            </button>
          </div>
        ))}
        <div className="d-flex gap-3 mt-3">
          <button className="btn btn-primary" onClick={addQuestion}>➕ Add Question</button>
          <button className="btn btn-success" onClick={handleSubmit}>{editMode ? "✏️ Update Quiz" : "✅ Submit Quiz"}</button>
          {editMode && (
            <button className="btn btn-secondary" onClick={resetForm}>❌ Cancel Edit</button>
          )}
        </div>
      </div>
    </div>

    {/* Quiz List */}
    <div>
      <h3 className="mb-3">📋 All Quizzes</h3>
      {quizList.length === 0 ? (
        <div className="alert alert-warning">No quizzes available.</div>
      ) : (
        <div className="row">
          {quizList.map((quiz) => (
            <div key={quiz.id} className="col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{quiz.title}</h5>
                  <p className="card-text">
                    <strong>Subject:</strong> {quiz.subject}<br />
                    <strong>Duration:</strong> {quiz.duration} mins<br />
                    <strong>Start:</strong> {new Date(quiz.start_time).toLocaleString()}<br />
                    <strong>End:</strong> {new Date(quiz.end_time).toLocaleString()}<br />
                    <strong>Published:</strong> {quiz.is_published ? "✅ Yes" : "❌ No"}
                  </p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-warning" onClick={() => handleEdit(quiz)}>✏️ Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(quiz.id)}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

};

// Separate helper functions for questions/options to keep the render clean
const handleQuestionTextChange = (qIndex, value) => {
  // This function is used in our component; you could move its logic into the component if needed.
  // For clarity, we assume these functions are defined inline as arrow functions in the component above.
};

const handleOptionTextChange = (qIndex, oIndex, value) => {
  // This function is similarly defined inline in the component above.
};

export default AdminDashboard;
