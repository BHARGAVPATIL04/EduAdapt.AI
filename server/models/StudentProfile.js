const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    educationLevel: {
      type: String,
      default: ""
    },

    branch: {
      type: String,
      default: ""
    },

    semester: {
      type: Number,
      default: null
    },

    subjects: {
      type: [String],
      default: []
    },

    interests: {
      type: [String],
      default: []
    },

    learningGoals: {
      type: [String],
      default: []
    },

    preferredLearningStyle: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);