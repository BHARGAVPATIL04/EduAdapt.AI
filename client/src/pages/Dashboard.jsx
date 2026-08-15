import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div className="app-page">

      <Navbar />

      <main className="main-content">

        <section className="hero-section">
          <h1>
            Welcome to EduAdapt.AI 👋
          </h1>

          <p>
            Your personalized adaptive learning platform.
            Learn smarter, practice better and track your progress.
          </p>
        </section>

        <section className="stats-grid">

          <div className="stat-card">
            <span className="stat-icon">📚</span>
            <h2>0</h2>
            <p>Available Courses</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🎯</span>
            <h2>0</h2>
            <p>Enrolled Courses</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📝</span>
            <h2>0</h2>
            <p>Practice Questions</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📈</span>
            <h2>0%</h2>
            <p>Overall Progress</p>
          </div>

        </section>

        <section className="dashboard-section">

          <h2>Welcome to your learning dashboard</h2>

          <p>
            Your courses, practice questions and learning progress
            will appear here.
          </p>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;