import React, { useEffect, useState } from "react";

function Progress() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/adaptive/analysis",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setError("Your session has expired. Please login again.");
        } else {
          setError(data.message || "Unable to load progress.");
        }

        return;
      }

      setAnalysis(data.analysis);

    } catch (error) {
      console.error("Progress error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="progress-page">
        <div className="loading-box">
          <div className="loader"></div>
          <h2>Analyzing Your Progress...</h2>
          <p>Please wait while we prepare your personalized learning analysis.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-page">
        <div className="error-box">
          <h2>⚠️ Unable to Load Progress</h2>
          <p>{error}</p>

          <button onClick={fetchAnalysis}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const strongTopics = analysis?.strongTopics || [];
  const needsPractice = analysis?.needsPractice || [];
  const weakTopics = analysis?.weakTopics || [];
  const recommendations = analysis?.recommendations || [];
  const learningPath = analysis?.learningPath || [];

  const totalTopics =
    strongTopics.length +
    needsPractice.length +
    weakTopics.length;

  return (
    <div className="progress-page">

      {/* HEADER */}
      <div className="progress-header">
        <div>
          <h1>📊 My Progress</h1>
          <p>
            Your personalized learning performance and adaptive analysis.
          </p>
        </div>

        <button className="refresh-btn" onClick={fetchAnalysis}>
          🔄 Refresh Analysis
        </button>
      </div>


      {/* SUMMARY CARDS */}
      <div className="progress-summary">

        <div className="summary-card">
          <div className="summary-icon">📚</div>
          <h3>{totalTopics}</h3>
          <p>Topics Analyzed</p>
        </div>

        <div className="summary-card strong-card">
          <div className="summary-icon">💪</div>
          <h3>{strongTopics.length}</h3>
          <p>Strong Topics</p>
        </div>

        <div className="summary-card practice-card">
          <div className="summary-icon">🎯</div>
          <h3>{needsPractice.length}</h3>
          <p>Need Practice</p>
        </div>

        <div className="summary-card weak-card">
          <div className="summary-icon">📖</div>
          <h3>{weakTopics.length}</h3>
          <p>Weak Topics</p>
        </div>

      </div>


      {/* STRONG TOPICS */}
      <section className="progress-section">

        <div className="section-title">
          <h2>💪 Strong Topics</h2>
          <span>{strongTopics.length}</span>
        </div>

        {strongTopics.length === 0 ? (
          <div className="empty-box">
            No strong topics yet. Keep practicing!
          </div>
        ) : (
          <div className="topic-grid">

            {strongTopics.map((item, index) => (

              <div className="topic-card strong-topic" key={index}>

                <div className="topic-header">
                  <h3>{item.topic}</h3>

                  <span className="accuracy-badge strong">
                    {item.accuracy}%
                  </span>
                </div>

                <p>
                  <strong>Course:</strong> {item.course}
                </p>

                <p>
                  <strong>Difficulty:</strong> {item.difficulty}
                </p>

                <div className="progress-bar">
                  <div
                    className="progress-fill strong-fill"
                    style={{
                      width: `${item.accuracy}%`
                    }}
                  ></div>
                </div>

                <p className="topic-message">
                  Excellent performance! 🚀
                </p>

              </div>

            ))}

          </div>
        )}

      </section>


      {/* NEEDS PRACTICE */}
      <section className="progress-section">

        <div className="section-title">
          <h2>🎯 Topics Needing Practice</h2>
          <span>{needsPractice.length}</span>
        </div>

        {needsPractice.length === 0 ? (
          <div className="empty-box">
            No topics currently need additional practice.
          </div>
        ) : (
          <div className="topic-grid">

            {needsPractice.map((item, index) => (

              <div className="topic-card practice-topic" key={index}>

                <div className="topic-header">
                  <h3>{item.topic}</h3>

                  <span className="accuracy-badge medium">
                    {item.accuracy}%
                  </span>
                </div>

                <p>
                  <strong>Course:</strong> {item.course}
                </p>

                <p>
                  <strong>Difficulty:</strong> {item.difficulty}
                </p>

                <div className="progress-bar">
                  <div
                    className="progress-fill medium-fill"
                    style={{
                      width: `${item.accuracy}%`
                    }}
                  ></div>
                </div>

                <p className="topic-message">
                  Practice a little more to improve. 🎯
                </p>

              </div>

            ))}

          </div>
        )}

      </section>


      {/* WEAK TOPICS */}
      <section className="progress-section">

        <div className="section-title">
          <h2>📖 Topics Requiring Attention</h2>
          <span>{weakTopics.length}</span>
        </div>

        {weakTopics.length === 0 ? (
          <div className="empty-box">
            Great! You currently have no weak topics.
          </div>
        ) : (
          <div className="topic-grid">

            {weakTopics.map((item, index) => (

              <div className="topic-card weak-topic" key={index}>

                <div className="topic-header">
                  <h3>{item.topic}</h3>

                  <span className="accuracy-badge weak">
                    {item.accuracy}%
                  </span>
                </div>

                <p>
                  <strong>Course:</strong> {item.course}
                </p>

                <p>
                  <strong>Difficulty:</strong> {item.difficulty}
                </p>

                <div className="progress-bar">
                  <div
                    className="progress-fill weak-fill"
                    style={{
                      width: `${item.accuracy}%`
                    }}
                  ></div>
                </div>

                <p className="topic-message">
                  Review the fundamentals and practice more. 📚
                </p>

              </div>

            ))}

          </div>
        )}

      </section>


      {/* RECOMMENDATIONS */}
      <section className="progress-section">

        <div className="section-title">
          <h2>🤖 AI Recommendations</h2>
          <span>{recommendations.length}</span>
        </div>

        {recommendations.length === 0 ? (
          <div className="empty-box">
            Complete some practice questions to receive recommendations.
          </div>
        ) : (
          <div className="recommendation-list">

            {recommendations.map((item, index) => (

              <div
                className={`recommendation-card ${item.priority?.toLowerCase()}`}
                key={index}
              >

                <div className="recommendation-priority">
                  {item.priority === "HIGH" && "🔴"}
                  {item.priority === "MEDIUM" && "🟡"}
                  {item.priority === "LOW" && "🟢"}

                  <span>{item.priority} PRIORITY</span>
                </div>

                <h3>{item.topic}</h3>

                <p className="recommendation-action">
                  <strong>Action:</strong> {item.action}
                </p>

                <p>
                  <strong>Why:</strong> {item.reason}
                </p>

              </div>

            ))}

          </div>
        )}

      </section>


      {/* LEARNING PATH */}
      <section className="progress-section">

        <div className="section-title">
          <h2>🧭 Your Adaptive Learning Path</h2>
          <span>{learningPath.length} Steps</span>
        </div>

        {learningPath.length === 0 ? (
          <div className="empty-box">
            Complete some questions to generate your personalized learning path.
          </div>
        ) : (
          <div className="learning-path">

            {learningPath.map((item, index) => (

              <div className="path-item" key={index}>

                <div className="path-number">
                  {item.step}
                </div>

                <div className="path-content">

                  <div className="path-top">

                    <h3>{item.topic}</h3>

                    <span className="level-badge">
                      {item.level}
                    </span>

                  </div>

                  <p className="path-action">
                    {item.action}
                  </p>

                  <p className="path-reason">
                    {item.reason}
                  </p>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Progress;