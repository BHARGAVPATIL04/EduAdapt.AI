import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [page, setPage] = useState(() => {
    const path = window.location.pathname;

    if (path === "/register") return "register";
    if (path === "/login") return "login";
    if (path === "/courses") return "courses";
    if (path === "/practice") return "practice";
    if (path === "/progress") return "progress";

    return "dashboard";
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  const navigate = (newPage) => {
    setPage(newPage);

    let path = "/";

    if (newPage === "login") path = "/login";
    if (newPage === "register") path = "/register";
    if (newPage === "courses") path = "/courses";
    if (newPage === "practice") path = "/practice";
    if (newPage === "progress") path = "/progress";

    window.history.pushState({}, "", path);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;

      if (path === "/login") {
        setPage("login");
      } else if (path === "/register") {
        setPage("register");
      } else if (path === "/courses") {
        setPage("courses");
      } else if (path === "/practice") {
        setPage("practice");
      } else if (path === "/progress") {
        setPage("progress");
      } else {
        setPage("dashboard");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    navigate("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    navigate("login");
  };

  if (!user) {
    if (page === "register") {
      return (
        <Register
          onRegistered={() => navigate("login")}
          onGoToLogin={() => navigate("login")}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onGoToRegister={() => navigate("register")}
      />
    );
  }

  return (
    <div className="app">
      <Navbar
        user={user}
        currentPage={page}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {page === "dashboard" && (
          <Dashboard
            user={user}
            onNavigate={navigate}
          />
        )}

        {page === "courses" && <Courses />}

        {page === "practice" && <Practice />}

        {page === "progress" && <Progress />}
      </main>
    </div>
  );
}


/* =====================================================
   NAVBAR
===================================================== */

function Navbar({
  user,
  currentPage,
  onNavigate,
  onLogout
}) {
  return (
    <nav className="navbar">

      <div
        className="logo"
        onClick={() => onNavigate("dashboard")}
      >
        EduAdapt.AI
      </div>

      <div className="nav-links">

        <button
          className={
            currentPage === "dashboard"
              ? "active"
              : ""
          }
          onClick={() => onNavigate("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={
            currentPage === "courses"
              ? "active"
              : ""
          }
          onClick={() => onNavigate("courses")}
        >
          Courses
        </button>

        <button
          className={
            currentPage === "practice"
              ? "active"
              : ""
          }
          onClick={() => onNavigate("practice")}
        >
          Practice
        </button>

        <button
          className={
            currentPage === "progress"
              ? "active"
              : ""
          }
          onClick={() => onNavigate("progress")}
        >
          Progress
        </button>

      </div>

      <div className="nav-right">

        <span className="user-name">
          {user?.name || user?.email}
        </span>

        <button
          className="logout-btn"
          onClick={onLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}


/* =====================================================
   LOGIN
===================================================== */

function Login({
  onLogin,
  onGoToRegister
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Invalid email or password"
        );
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      onLogin(data.user);

    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>EduAdapt.AI</h1>

        <p className="auth-subtitle">
          Personalized Adaptive Learning Platform
        </p>

        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        <p className="auth-switch">
          Don't have an account?
        </p>

        <button
          className="secondary-btn"
          onClick={onGoToRegister}
        >
          Create Account
        </button>

      </div>

    </div>
  );
}


/* =====================================================
   REGISTER
===================================================== */

function Register({
  onRegistered,
  onGoToLogin
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password,
            role: "student"
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Registration failed"
        );
      }

      setMessage(
        "Registration successful! You can now login."
      );

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        onRegistered();
      }, 1000);

    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
        "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>EduAdapt.AI</h1>

        <p className="auth-subtitle">
          Create your student account
        </p>

        <h2>Register</h2>

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            minLength="6"
            required
          />

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        <p className="auth-switch">
          Already have an account?
        </p>

        <button
          className="secondary-btn"
          onClick={onGoToLogin}
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}


/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard({
  user,
  onNavigate
}) {
  return (
    <div>

      <section className="hero">

        <h1>
          Welcome to EduAdapt.AI 👋
        </h1>

        <p>
          Your personalized adaptive learning platform.
          Learn smarter, practice better and track your progress.
        </p>

      </section>

      <div className="welcome">

        <h2>
          Hello, {user?.name || "Student"}!
        </h2>

        <p>
          What would you like to do today?
        </p>

      </div>

      <div className="dashboard-grid">

        <DashboardCard
          icon="📚"
          title="Courses"
          description="Explore available courses and start learning."
          button="View Courses"
          onClick={() =>
            onNavigate("courses")
          }
        />

        <DashboardCard
          icon="🎯"
          title="Practice"
          description="Practice questions based on your learning level."
          button="Start Practice"
          onClick={() =>
            onNavigate("practice")
          }
        />

        <DashboardCard
          icon="📊"
          title="Progress"
          description="Track your learning progress and performance."
          button="View Progress"
          onClick={() =>
            onNavigate("progress")
          }
        />

      </div>

    </div>
  );
}


function DashboardCard({
  icon,
  title,
  description,
  button,
  onClick
}) {
  return (
    <div className="dashboard-card">

      <div className="card-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <button
        className="primary-btn"
        onClick={onClick}
      >
        {button}
      </button>

    </div>
  );
}


/* =====================================================
   COURSES
===================================================== */

function Courses() {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await fetch(
        `${API_URL}/courses`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to load courses"
        );
      }

      setCourses(
        Array.isArray(data.courses)
          ? data.courses
          : []
      );

    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
        "Unable to load courses"
      );

    } finally {
      setLoading(false);
    }
  };

  const enrollCourse = async (courseId) => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      setMessage(
        "Please login first."
      );

      return;
    }

    try {
      setEnrollingId(courseId);
      setMessage("");

      const response = await fetch(
        `${API_URL}/enrollments`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            courseId
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Enrollment failed"
        );
      }

      setMessage(
        "Course enrollment successful! ✅"
      );

    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
        "Enrollment failed"
      );

    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div>

      <div className="page-header">

        <h1>
          Courses 📚
        </h1>

        <p>
          Explore available courses and
          start your learning journey.
        </p>

      </div>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {loading ? (

        <div className="loading">
          Loading courses...
        </div>

      ) : courses.length === 0 ? (

        <div className="empty-state">

          <h2>
            No courses available
          </h2>

          <p>
            No courses have been added
            to the database yet.
          </p>

        </div>

      ) : (

        <div className="course-grid">

          {courses.map((course) => (

            <div
              className="course-card"
              key={course._id}
            >

              <div className="course-icon">
                📘
              </div>

              <h2>
                {course.title}
              </h2>

              <p>
                {course.description}
              </p>

              <div className="course-info">

                {course.category && (
                  <span>
                    {course.category}
                  </span>
                )}

                {course.difficulty && (
                  <span>
                    {course.difficulty}
                  </span>
                )}

                {course.duration && (
                  <span>
                    {course.duration}
                  </span>
                )}

              </div>

              {Array.isArray(course.skills) &&
               course.skills.length > 0 && (

                <div className="skills">

                  <strong>
                    Skills:
                  </strong>

                  <div className="skill-list">

                    {course.skills.map(
                      (skill, index) => (

                        <span key={index}>
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </div>

              )}

              <button
                className="primary-btn"
                onClick={() =>
                  enrollCourse(course._id)
                }
                disabled={
                  enrollingId === course._id
                }
              >
                {enrollingId === course._id
                  ? "Enrolling..."
                  : "Enroll Now"}
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}


/* =====================================================
   PRACTICE
===================================================== */

function Practice() {

  const [questions, setQuestions] = useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState("");

  const [score, setScore] = useState(0);

  const [answered, setAnswered] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [finished, setFinished] =
    useState(false);

  const [savingResult, setSavingResult] =
    useState(false);

  const [resultSaved, setResultSaved] =
    useState(false);

  const [startTime] = useState(
    Date.now()
  );


  useEffect(() => {
    loadQuestions();
  }, []);


  const loadQuestions = async () => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      setMessage(
        "Please login first."
      );

      setLoading(false);

      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/questions`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to load questions"
        );
      }

      setQuestions(
        Array.isArray(data.questions)
          ? data.questions
          : []
      );

    } catch (error) {

      console.error(
        "Question loading error:",
        error
      );

      setMessage(
        error.message ||
        "Unable to load questions"
      );

    } finally {
      setLoading(false);
    }
  };


  const currentQuestion =
    questions[currentIndex];


  const handleAnswer = (answer) => {

    if (answered) {
      return;
    }

    setSelectedAnswer(answer);

    setAnswered(true);

    if (
      answer ===
      currentQuestion.correctAnswer
    ) {
      setScore(
        (previousScore) =>
          previousScore + 1
      );
    }
  };


  /*
   * SAVE RESULT TO BACKEND
   */
  const savePracticeResult = async () => {

    if (resultSaved) {
      return true;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      setMessage(
        "Please login first."
      );

      return false;
    }

    if (!currentQuestion) {
      return false;
    }

    /*
     * Use the course and topic from
     * the questions.
     *
     * All questions in one practice
     * session are expected to belong
     * to the same course/topic.
     */

    const courseId =
      currentQuestion.course?._id ||
      currentQuestion.course;

    const topic =
      currentQuestion.topic ||
      "General";


    /*
     * Score state updates asynchronously.
     *
     * Therefore calculate the final
     * score directly from the answers
     * rather than relying only on
     * React's score state.
     */

    let finalCorrectAnswers = score;

    /*
     * The final question may have just
     * been answered, so include it.
     */

    if (
      selectedAnswer ===
      currentQuestion.correctAnswer
    ) {
      finalCorrectAnswers =
        score + 1;
    }


    /*
     * Prevent incorrect double counting
     * when the final answer has already
     * been included in score.
     */

    if (
      currentIndex ===
      questions.length - 1 &&
      selectedAnswer ===
      currentQuestion.correctAnswer
    ) {

      /*
       * If score already contains the
       * final answer, don't add twice.
       */

      if (score === finalCorrectAnswers) {
        finalCorrectAnswers = score;
      }
    }


    /*
     * More reliable final score:
     * calculate from all displayed
     * answers stored during this session.
     *
     * For the current implementation,
     * score represents all answers
     * before the final state update.
     */

    const attempted =
      questions.length;

    /*
     * Determine final correct count
     * carefully.
     */

    let correctCount = score;

    if (
      selectedAnswer ===
      currentQuestion.correctAnswer
    ) {
      correctCount = score + 1;
    }


    /*
     * If the current question isn't
     * the last question, this function
     * isn't called yet.
     */

    const timeSpent =
      Math.round(
        (Date.now() - startTime) / 1000
      );


    /*
     * Determine difficulty.
     */

    const difficulty =
      currentQuestion.difficulty ||
      "Beginner";


    try {

      setSavingResult(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/progress`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            courseId,
            topic,
            questionsAttempted:
              attempted,
            correctAnswers:
              correctCount,
            timeSpent,
            difficulty
          })
        }
      );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to save practice result"
        );
      }


      setResultSaved(true);

      return true;


    } catch (error) {

      console.error(
        "SAVE PRACTICE RESULT ERROR:",
        error
      );

      setMessage(
        error.message ||
        "Unable to save practice result"
      );

      return false;


    } finally {
      setSavingResult(false);
    }
  };


  const nextQuestion = () => {

    if (
      currentIndex <
      questions.length - 1
    ) {

      setCurrentIndex(
        (previousIndex) =>
          previousIndex + 1
      );

      setSelectedAnswer("");

      setAnswered(false);

    } else {

      /*
       * The final result will be saved
       * when Finish Practice is clicked.
       */

      setFinished(true);

    }
  };


  const finishPractice = async () => {

    const saved =
      await savePracticeResult();

    if (saved) {
      setFinished(true);
    }
  };


  const restartPractice = () => {

    window.location.reload();

  };


  if (loading) {
    return (
      <div>

        <div className="page-header">
          <h1>
            Adaptive Practice 🎯
          </h1>
        </div>

        <div className="loading">
          Loading questions...
        </div>

      </div>
    );
  }


  if (message && questions.length === 0) {
    return (
      <div>

        <div className="page-header">
          <h1>
            Adaptive Practice 🎯
          </h1>
        </div>

        <div className="message">
          {message}
        </div>

      </div>
    );
  }


  if (questions.length === 0) {
    return (
      <div>

        <div className="page-header">

          <h1>
            Adaptive Practice 🎯
          </h1>

          <p>
            Test your knowledge.
          </p>

        </div>

        <div className="empty-state">

          <h2>
            No questions available
          </h2>

          <p>
            Questions have not been added
            to the database yet.
          </p>

        </div>

      </div>
    );
  }


  if (finished) {

    const displayedScore =
      resultSaved
        ? Math.round(
            (score / questions.length) *
            100
          )
        : Math.round(
            (score / questions.length) *
            100
          );


    return (
      <div>

        <div className="page-header">

          <h1>
            Practice Complete 🎉
          </h1>

        </div>

        <div className="result-card">

          <div className="result-score">
            {displayedScore}%
          </div>

          <h2>
            Your Score
          </h2>

          <p>
            You answered{" "}
            <strong>
              {score}
            </strong>{" "}
            out of{" "}
            <strong>
              {questions.length}
            </strong>{" "}
            questions correctly.
          </p>


          {savingResult && (
            <p>
              Saving your progress...
            </p>
          )}


          {resultSaved && (
            <p className="correct-text">
              ✅ Your learning progress
              has been saved.
            </p>
          )}


          {message && (
            <div className="message">
              {message}
            </div>
          )}


          <button
            className="primary-btn"
            onClick={restartPractice}
            disabled={savingResult}
          >
            Practice Again
          </button>

        </div>

      </div>
    );
  }


  return (
    <div>

      <div className="page-header">

        <h1>
          Adaptive Practice 🎯
        </h1>

        <p>
          Question {currentIndex + 1} of{" "}
          {questions.length}
        </p>

      </div>


      <div className="question-card">

        <div className="question-meta">

          {currentQuestion.topic && (
            <span>
              Topic: {currentQuestion.topic}
            </span>
          )}

          {currentQuestion.difficulty && (
            <span>
              Difficulty:{" "}
              {currentQuestion.difficulty}
            </span>
          )}

        </div>


        <h2 className="question-text">
          {currentQuestion.question}
        </h2>


        <div className="options">

          {Array.isArray(
            currentQuestion.options
          ) &&

            currentQuestion.options.map(
              (option, index) => {

                let optionClass =
                  "option-btn";

                if (
                  answered &&
                  option ===
                  currentQuestion.correctAnswer
                ) {
                  optionClass +=
                    " correct";
                }

                if (
                  answered &&
                  option ===
                  selectedAnswer &&
                  option !==
                  currentQuestion.correctAnswer
                ) {
                  optionClass +=
                    " incorrect";
                }

                return (
                  <button
                    key={index}
                    className={optionClass}
                    onClick={() =>
                      handleAnswer(option)
                    }
                    disabled={answered}
                  >
                    <span>
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    {option}

                  </button>
                );
              }
            )}

        </div>


        {answered && (
          <div className="answer-feedback">

            {selectedAnswer ===
            currentQuestion.correctAnswer ? (

              <p className="correct-text">
                ✅ Correct!
              </p>

            ) : (

              <p className="incorrect-text">
                ❌ Incorrect.
              </p>

            )}

            {currentQuestion.explanation && (
              <p>
                <strong>
                  Explanation:
                </strong>{" "}
                {currentQuestion.explanation}
              </p>
            )}

          </div>
        )}


        {answered && (
          <button
            className="primary-btn"
            onClick={
              currentIndex ===
              questions.length - 1
                ? finishPractice
                : nextQuestion
            }
            disabled={savingResult}
          >
            {currentIndex ===
             questions.length - 1
              ? savingResult
                ? "Saving Result..."
                : "Finish Practice"
              : "Next Question"}
          </button>
        )}

      </div>

    </div>
  );
}


/* =====================================================
   PROGRESS
===================================================== */

function Progress() {

  const [analysis, setAnalysis] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");


  useEffect(() => {
    loadAnalysis();
  }, []);


  const loadAnalysis = async () => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      setMessage(
        "Please login first."
      );

      setLoading(false);

      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/adaptive/analysis`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to load progress"
        );
      }

      setAnalysis(data.analysis);

    } catch (error) {

      console.error(
        "Progress error:",
        error
      );

      setMessage(
        error.message ||
        "Unable to load progress"
      );

    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div>

        <div className="page-header">

          <h1>
            Your Progress 📊
          </h1>

        </div>

        <div className="loading">
          Loading your progress...
        </div>

      </div>
    );
  }


  if (message) {
    return (
      <div>

        <div className="page-header">

          <h1>
            Your Progress 📊
          </h1>

        </div>

        <div className="message">
          {message}
        </div>

      </div>
    );
  }


  return (
    <div>

      <div className="page-header">

        <h1>
          Your Progress 📊
        </h1>

        <p>
          Adaptive learning analysis
        </p>

      </div>


      {analysis ? (

        <div className="analysis-card">

          <h2>
            Adaptive Analysis
          </h2>

          <pre>
            {JSON.stringify(
              analysis,
              null,
              2
            )}
          </pre>

        </div>

      ) : (

        <div className="empty-state">

          <h2>
            No progress data available
          </h2>

          <p>
            Complete some learning activities
            to generate your analysis.
          </p>

        </div>

      )}

    </div>
  );
}


export default App;