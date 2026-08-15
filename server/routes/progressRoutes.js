const express = require("express");
const LearningProgress = require("../models/LearningProgress");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// SAVE PRACTICE RESULT
// POST /api/progress
// =====================================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      courseId,
      topic,
      questionsAttempted,
      correctAnswers,
      timeSpent,
      difficulty
    } = req.body;


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!courseId || !topic) {
      return res.status(400).json({
        message: "Course ID and topic are required"
      });
    }

    if (
      questionsAttempted === undefined ||
      correctAnswers === undefined
    ) {
      return res.status(400).json({
        message:
          "Questions attempted and correct answers are required"
      });
    }


    // -------------------------------------------------
    // CALCULATE ACCURACY
    // -------------------------------------------------

    const attempted = Number(questionsAttempted);
    const correct = Number(correctAnswers);

    if (attempted <= 0) {
      return res.status(400).json({
        message: "Questions attempted must be greater than 0"
      });
    }

    if (correct < 0 || correct > attempted) {
      return res.status(400).json({
        message: "Invalid correct answer count"
      });
    }

    const accuracy =
      Math.round((correct / attempted) * 100);


    // -------------------------------------------------
    // FIND EXISTING PROGRESS
    // -------------------------------------------------

    let progress = await LearningProgress.findOne({
      user: req.user.id,
      course: courseId,
      topic: topic
    });


    // -------------------------------------------------
    // UPDATE EXISTING PROGRESS
    // -------------------------------------------------

    if (progress) {

      const oldAttempted =
        progress.questionsAttempted || 0;

      const oldCorrect =
        progress.correctAnswers || 0;

      const newAttempted =
        oldAttempted + attempted;

      const newCorrect =
        oldCorrect + correct;

      const newAccuracy =
        Math.round(
          (newCorrect / newAttempted) * 100
        );


      progress.questionsAttempted =
        newAttempted;

      progress.correctAnswers =
        newCorrect;

      progress.accuracy =
        newAccuracy;

      progress.timeSpent =
        (progress.timeSpent || 0) +
        Number(timeSpent || 0);

      progress.difficulty =
        difficulty ||
        progress.difficulty;

      progress.lastScore =
        accuracy;

      await progress.save();

    }


    // -------------------------------------------------
    // CREATE NEW PROGRESS
    // -------------------------------------------------

    else {

      progress =
        await LearningProgress.create({
          user: req.user.id,

          course: courseId,

          topic: topic,

          questionsAttempted:
            attempted,

          correctAnswers:
            correct,

          accuracy:
            accuracy,

          timeSpent:
            Number(timeSpent || 0),

          difficulty:
            difficulty || "Beginner",

          lastScore:
            accuracy
        });
    }


    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    res.status(200).json({
      message:
        "Learning progress saved successfully",

      progress
    });


  } catch (error) {

    console.error(
      "SAVE PROGRESS ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// =====================================================
// GET MY LEARNING PROGRESS
// GET /api/progress
// =====================================================

router.get("/", authMiddleware, async (req, res) => {
  try {

    const progress =
      await LearningProgress.find({
        user: req.user.id
      })
      .populate(
        "course",
        "title category"
      )
      .sort({
        updatedAt: -1
      });


    res.status(200).json({
      message:
        "Learning progress fetched successfully",

      progress
    });


  } catch (error) {

    console.error(
      "GET PROGRESS ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


module.exports = router;