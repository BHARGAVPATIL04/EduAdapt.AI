const mongoose = require("mongoose");

const learningProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    topic: {
      type: String,
      required: true
    },

    questionsAttempted: {
      type: Number,
      default: 0
    },

    correctAnswers: {
      type: Number,
      default: 0
    },

    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    timeSpent: {
      type: Number,
      default: 0
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },

    lastScore: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "LearningProgress",
  learningProgressSchema
);