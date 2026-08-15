import Navbar from "../components/Navbar";

function Practice() {
  return (
    <div className="app-page">

      <Navbar />

      <main className="main-content">

        <div className="page-header">
          <h1>Adaptive Practice 🧠</h1>

          <p>
            Practice questions based on your learning level
            and improve your skills.
          </p>
        </div>

        <div className="practice-card">

          <h2>Ready to Practice?</h2>

          <p>
            Your personalized questions will appear here.
          </p>

          <button className="primary-button">
            Start Practice
          </button>

        </div>

      </main>

    </div>
  );
}

export default Practice;