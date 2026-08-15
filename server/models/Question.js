const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    topic: {
      type: String,
      required: true
    },

    question: {
      type: String,
      required: true
    },

    options: {
      type: [String],
      required: true
    },

    correctAnswer: {
      type: String,
      required: true
    },

    explanation: {
      type: String,
      default: ""
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Question", questionSchema);