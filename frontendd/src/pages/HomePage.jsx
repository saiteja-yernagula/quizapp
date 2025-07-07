import React from "react";
import { Link } from "react-router-dom";

function Homepage() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">🎓 Quiz Platform</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navLinks">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navLinks">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
              <li className="nav-item"><Link to="/login" className="nav-link">Student Login</Link></li>
              <li className="nav-item"><Link to="/admin/login" className="nav-link">Admin Login</Link></li>
              <li className="nav-item"><Link to="/register" className="nav-link">Student Register</Link></li>
              <li className="nav-item"><Link to="/admin/register" className="nav-link">Admin Register</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-light py-5 text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Welcome to the Online Quiz Portal</h1>
          
          <p className="lead mb-4">Test your knowledge. View results. Administer quizzes with ease.</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-primary btn-lg">🎓 Student Login</Link>
            <Link to="/admin/login" className="btn btn-success btn-lg">🧑‍💼 Admin Login</Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-5 bg-white text-center">
        <div className="container">
          <h2 className="fw-bold mb-4 text-primary">About the Platform</h2>
          
          <p className="lead text-muted">
            Our platform enables students to take quizzes and receive instant feedback.
            Admins can manage quizzes, track performance, and export results for analysis.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center mb-5 text-primary">✨ Features</h2>
          <div className="row">
            {[
              "🔐 Secure JWT Login",
              "⏳ Quiz Timer & Auto-Submit",
              "📊 Detailed Analytics",
              "🧑‍💼 Admin Dashboard",
              "📁 Excel/CSV Upload",
              "📈 Result Visualization"
            ].map((feature, i) => (
              <div className="col-md-4 mb-4" key={i}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body text-center">
                    <h5 className="card-title">{feature}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Panels Section */}
      <section className="py-5 bg-white text-center">
        <div className="container">
          <h2 className="fw-bold text-primary mb-4">Access Panels</h2>
          <div className="row justify-content-center">
            <div className="col-md-5 mb-4">
              <div className="card border-primary shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">🎓 Student Panel</h5>
                  <p className="card-text">Take quizzes and view results.</p>
                  <Link to="/login" className="btn btn-outline-primary">Go to Student Login</Link>
                </div>
              </div>
            </div>
            <div className="col-md-5 mb-4">
              <div className="card border-success shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-success">🧑‍💼 Admin Panel</h5>
                  <p className="card-text">Create & monitor quizzes, view analytics.</p>
                  <Link to="/admin/login" className="btn btn-outline-success">Go to Admin Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 bg-light text-center" id="testimonials">
        <div className="container">
          <h2 className="fw-bold text-primary mb-5">📣 What Users Say</h2>
          <div className="row g-4">
            {[
              { name: "Anjali", msg: "The platform is super easy and effective for online exams!" },
              { name: "Rahul", msg: "As an admin, I love how seamless quiz creation and analysis is." },
              { name: "Sneha", msg: "Timer, instant feedback, and result tracking are top-notch!" },
            ].map((t, i) => (
              <div className="col-md-4" key={i}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <p className="fst-italic text-muted">"{t.msg}"</p>
                    <h6 className="mt-3 fw-bold text-primary">– {t.name}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-5 bg-white" id="contact">
        <div className="container">
          <h2 className="fw-bold text-center text-primary mb-5">📬 Contact Us</h2>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <form>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Your Name" required />
                </div>
                <div className="mb-3">
                  <input type="email" className="form-control" placeholder="Your Email" required />
                </div>
                <div className="mb-3">
                  <textarea className="form-control" rows="4" placeholder="Your Message" required></textarea>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary px-5">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white text-center py-3">
        <p className="mb-0">© {new Date().getFullYear()} Quiz Platform | Built with ❤️ by Teja</p>
      </footer>
    </div>
  );
}

export default Homepage;
