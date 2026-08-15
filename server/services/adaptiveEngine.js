const LearningProgress = require("../models/LearningProgress");

const generateAdaptiveAnalysis = async (userId) => {
  const progressData = await LearningProgress.find({
    user: userId
  }).populate("course", "title category");

  const analysis = {
    strongTopics: [],
    needsPractice: [],
    weakTopics: [],
    recommendations: [],
    learningPath: []
  };

  progressData.forEach((item) => {
    const accuracy = item.accuracy;

    const topicData = {
      topic: item.topic,
      accuracy: Math.round(accuracy),
      course: item.course?.title || "Unknown Course",
      difficulty: item.difficulty
    };

    if (accuracy >= 80) {
      analysis.strongTopics.push(topicData);
    } else if (accuracy >= 60) {
      analysis.needsPractice.push(topicData);
    } else {
      analysis.weakTopics.push(topicData);
    }
  });


  // ==========================================
  // WEAK TOPICS
  // ==========================================

  analysis.weakTopics.forEach((item) => {

    analysis.recommendations.push({
      priority: "HIGH",
      topic: item.topic,
      action: "Review fundamentals and complete beginner-level practice.",
      reason: `Current accuracy is ${item.accuracy}%.`
    });

    analysis.learningPath.push({
      step: analysis.learningPath.length + 1,
      topic: item.topic,
      level: "Foundation",
      action: "Learn the fundamentals",
      reason: `Your accuracy is ${item.accuracy}%, indicating a knowledge gap.`,
      priority: "HIGH"
    });

    analysis.learningPath.push({
      step: analysis.learningPath.length + 1,
      topic: item.topic,
      level: "Practice",
      action: "Complete targeted practice questions",
      reason: "Practice will reinforce the missing concepts.",
      priority: "HIGH"
    });

    analysis.learningPath.push({
      step: analysis.learningPath.length + 1,
      topic: item.topic,
      level: "Reassessment",
      action: "Take a short reassessment",
      reason: "The system will check whether your understanding improved.",
      priority: "HIGH"
    });
  });


  // ==========================================
  // TOPICS NEEDING PRACTICE
  // ==========================================

  analysis.needsPractice.forEach((item) => {

    analysis.recommendations.push({
      priority: "MEDIUM",
      topic: item.topic,
      action: "Practice more questions before moving to advanced difficulty.",
      reason: `Current accuracy is ${item.accuracy}%.`
    });

    analysis.learningPath.push({
      step: analysis.learningPath.length + 1,
      topic: item.topic,
      level: "Targeted Practice",
      action: "Complete targeted practice questions",
      reason: `Your accuracy is ${item.accuracy}%.`,
      priority: "MEDIUM"
    });

    analysis.learningPath.push({
      step: analysis.learningPath.length + 1,
      topic: item.topic,
      level: "Challenge",
      action: "Try intermediate-level questions",
      reason: "Your performance suggests you are ready for additional challenge.",
      priority: "MEDIUM"
    });
  });


  // ==========================================
  // STRONG TOPICS
  // ==========================================

  analysis.strongTopics.forEach((item) => {

    analysis.recommendations.push({
      priority: "LOW",
      topic: item.topic,
      action: "Move to advanced questions or the next topic.",
      reason: `Current accuracy is ${item.accuracy}%.`
    });

    analysis.learningPath.push({
      step: analysis.learningPath.length + 1,
      topic: item.topic,
      level: "Advanced",
      action: "Skip basic content and attempt advanced challenges",
      reason: `Your accuracy is ${item.accuracy}%.`,
      priority: "LOW"
    });
  });


  return analysis;
};

module.exports = generateAdaptiveAnalysis;