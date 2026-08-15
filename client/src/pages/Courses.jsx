import Navbar from "../components/Navbar";

function Courses() {
  return (
    <div className="app-page">

      <Navbar />

      <main className="main-content">

        <div className="page-header">
          <h1>Courses</h1>

          <p>
            Explore courses and start learning.
          </p>
        </div>

        <section className="course-grid">

          <div className="course-card">

            <div className="course-icon">
              📘
            </div>

            <h2>Python Programming</h2>

            <p>
              Learn Python programming from basics
              to advanced concepts.
            </p>

            <span className="course-level">
              Beginner
            </span>

            <button className="primary-button">
              Enroll Now
            </button>

          </div>

          <div className="course-card">

            <div className="course-icon">
              💻
            </div>

            <h2>Programming Fundamentals</h2>

            <p>
              Learn programming concepts and
              problem-solving techniques.
            </p>

            <span className="course-level">
              Beginner
            </span>

            <button className="primary-button">
              Enroll Now
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Courses;