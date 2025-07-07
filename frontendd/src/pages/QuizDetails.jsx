import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';

const QuizDetails = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
const [switchCount, setSwitchCount] = useState(0);
  const answersRef = useRef({});
  const beepSoundRef = useRef(null);
  const hasPlayedRef = useRef(false);
  const [quizStarted, setQuizStarted] = useState(false);


  // Fullscreen & security setup
  useEffect(() => {
    const lockScreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    };

    const disableShortcuts = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && ["r", "w", "t", "n"].includes(e.key.toLowerCase())) ||
        e.key === "Escape" ||
        e.altKey
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const preventBack = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const disableRightClick = (e) => e.preventDefault();

    lockScreen();
    window.addEventListener("keydown", disableShortcuts);
    window.addEventListener("beforeunload", preventBack);
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      window.removeEventListener("keydown", disableShortcuts);
      window.removeEventListener("beforeunload", preventBack);
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  // Load quiz
  useEffect(() => {
    api.get(`quizzes/${id}/`)
      .then(res => {
        setQuiz(res.data);
        setTimeLeft(res.data.duration * 60);
      })
      .catch(() => toast.error("Failed to load quiz"));
  }, [id]);


useEffect(() => {
  const handleTabSwitch = () => {
    setSwitchCount(prev => {
      if (prev === 0) {
        beepSoundRef.current?.play();
        toast.warn("⚠️ Tab switch detected. Stay on the quiz page.");
      } else if (prev === 1) {
        toast.error("❌ Second switch detected. Auto-submitting your quiz.");
        handleSubmit();
      }
      return prev + 1;
    });
  };

  window.addEventListener("blur", handleTabSwitch);
  return () => window.removeEventListener("blur", handleTabSwitch);
}, []);
  // Preload beep sound
  useEffect(() => {
    beepSoundRef.current = new Audio("/beep.mp3");
    beepSoundRef.current.load();
  }, []);

  // Timer and autosubmit
  useEffect(() => {
    if (!quiz || result) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 11 && !hasPlayedRef.current) {
          beepSoundRef.current?.play();
          setShowWarning(true);
          hasPlayedRef.current = true;
        }
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quiz, result]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleOptionChange = (qid, oid) => {
    const updated = { ...answers, [qid]: oid };
    setAnswers(updated);
    answersRef.current = updated;
  };

  const handleSubmit = async () => {
    if (result) return;
    beepSoundRef.current?.pause();
    beepSoundRef.current.currentTime = 0;
    try {
      const res = await api.post(`quizzes/${id}/submit/`, {
        answers: answersRef.current,
      });
      setResult(res.data);
      setCorrectAnswers(res.data.correct_answers || {});
      toast.success(`🎉 ${res.data.message}`);

      // Exit fullscreen after quiz submission
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } catch {
      toast.error("Failed to submit quiz");
    }
  };

  if (!quiz) return <div className="text-center mt-5">📦 Loading quiz...</div>;
  if (!quiz.questions?.length) return <div className="text-center mt-5">No questions found.</div>;


return (
  <div className="container py-5">
    {!quizStarted ? (
      <div className="text-center py-5">
        <h2 className="text-primary fw-bold mb-4">📢 Before You Start the Quiz</h2>
        <ul className="list-group list-group-flush mb-4 text-start mx-auto" style={{ maxWidth: "600px" }}>
          <li className="list-group-item">🔒 The quiz will enter fullscreen mode.</li>
          <li className="list-group-item">⚠️ Switching tabs or apps will trigger warnings and auto-submit on second attempt.</li>
          <li className="list-group-item">🕒 Your time will begin once you click start.</li>
          <li className="list-group-item">🚫 Keyboard shortcuts, right-click, and zoom are disabled.</li>
          <li className="list-group-item">📩 Submit before time runs out to save your answers.</li>
        </ul>
        <button
          className="btn btn-success px-4 py-2 fs-5"
          onClick={() => setQuizStarted(true)}
        >
          ✅ I Understand, Start Quiz
        </button>
      </div>
    ) : (
      // 👇 this is your actual quiz UI
      <>
        <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="text-primary fw-bold mb-0">{quiz.title}</h2>
        {!result && (
          <div className="bg-dark text-white px-3 py-1 rounded fs-5">
            ⏳ {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Result Card */}
      {result && (
        <motion.div
          className="shadow-lg border border-success rounded-4 p-4 mb-4 bg-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div className="d-flex align-items-center gap-3 mb-3">
            <div
              className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: 60, height: 60 }}
            >
              <span className="fs-3">✅</span>
            </div>
            <h4 className="fw-bold text-success mb-0">
              Quiz Submitted Successfully
            </h4>
          </div>

          <hr />

          <div className="row text-center">
            <div className="col-sm-6 col-md-3 mb-3">
              <div className="fw-semibold text-secondary">Total Questions</div>
              <div className="fs-5 fw-bold">{result.total}</div>
            </div>
            <div className="col-sm-6 col-md-3 mb-3">
              <div className="fw-semibold text-secondary">Correct Answers</div>
              <div className="fs-5 fw-bold text-success">{result.score}</div>
            </div>
            <div className="col-sm-6 col-md-3 mb-3">
              <div className="fw-semibold text-secondary">Percentage</div>
              <div
                className={`fs-5 fw-bold ${
                  result.score_percentage >= 50 ? "text-success" : "text-danger"
                }`}
              >
                {result.score_percentage}%
              </div>
            </div>
            <div className="col-sm-6 col-md-3 mb-3">
              <div className="fw-semibold text-secondary">Status</div>
              <span
                className={`badge px-3 py-2 ${
                  result.score_percentage >= 50 ? "bg-success" : "bg-danger"
                }`}
              >
                {result.score_percentage >= 50 ? "Pass" : "Fail"}
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              className="btn btn-outline-primary btn-lg px-4"
              onClick={() => (window.location.href = "/results/student")}
            >
              📊 View My Results
            </button>
          </div>
        </motion.div>
      )}

      {/* 10s Warning Modal */}
      {showWarning && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content border border-warning shadow">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">⚠️ Hurry up!</h5>
              </div>
              <div className="modal-body">
                <p>
                  ⏱ Less than 10 seconds left. Please finish and submit your quiz!
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-warning"
                  onClick={() => setShowWarning(false)}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Form */}
      <form className="mt-4">
        {quiz.questions.map((q) => (
          <div key={q.id} className="mb-5">
            <div className="bg-light p-3 rounded shadow-sm">
              <h5 className="fw-bold mb-3">{q.text}</h5>
              {q.options.map((opt) => {
                const isCorrect = correctAnswers[q.id] === opt.id;
                const isSelected = answers[q.id] === opt.id;
                const showAnswer = result !== null;

                let classes = "form-check mb-2 p-2 rounded";
                if (showAnswer) {
                  if (isCorrect) classes += " bg-success text-white";
                  else if (isSelected && !isCorrect)
                    classes += " bg-danger text-white";
                }

                return (
                  <div key={opt.id} className={classes}>
                    <input
                      className="form-check-input me-2"
                      type="radio"
                      name={`question_${q.id}`}
                      value={opt.id}
                      checked={isSelected}
                      disabled={showAnswer}
                      onChange={() => handleOptionChange(q.id, opt.id)}
                    />
                    <label className="form-check-label">{opt.text}</label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {!result && (
          <div className="text-center">
            <button
              type="button"
              className="btn btn-success px-4 py-2 fs-5"
              onClick={handleSubmit}
            >
              ✅ Submit Quiz
            </button>
          </div>
        )}
      </form>
    </div>
      </>
    )}
  </div>
);



};

export default QuizDetails;


// select items from fooditems group by items having sum(prices)>avg(prices)
// mouse - mousemove mouserover mouseout
// 