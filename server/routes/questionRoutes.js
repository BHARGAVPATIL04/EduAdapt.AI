const express = require("express");
const Question = require("../models/Question");
const Course = require("../models/Course");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// CREATE ONE OR MULTIPLE QUESTIONS
// POST /api/questions
// =====================================================

router.post("/", authMiddleware, async (req, res) => {
  try {

    // Accept either:
    // { ... }              -> single question
    // [ { ... }, {...} ]   -> multiple questions

    const questions = Array.isArray(req.body)
      ? req.body
      : [req.body];


    if (questions.length === 0) {
      return res.status(400).json({
        message: "At least one question is required"
      });
    }


    // Validate every question
    for (const question of questions) {

      const {
        courseId,
        topic,
        question: questionText,
        options,
        correctAnswer
      } = question;


      if (
        !courseId ||
        !topic ||
        !questionText ||
        !options ||
        !correctAnswer
      ) {
        return res.status(400).json({
          message:
            "Course ID, topic, question, options and correct answer are required"
        });
      }


      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          message: "Options must be an array containing at least 2 options"
        });
      }


      if (!options.includes(correctAnswer)) {
        return res.status(400).json({
          message: "Correct answer must be one of the options"
        });
      }


      // Check course exists
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          message: `Course not found: ${courseId}`
        });
      }
    }


    // Create all questions
    const createdQuestions = await Question.insertMany(
  questions.map((q) => ({
    course: q.courseId,
    topic: q.topic,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || "",
    difficulty: q.difficulty || "Beginner"
  }))
);


    res.status(201).json({
      message: `${createdQuestions.length} question(s) created successfully`,
      questions: createdQuestions
    });


  } catch (error) {

    console.error("QUESTION CREATION ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// =====================================================
// GET ALL QUESTIONS
// GET /api/questions
// =====================================================

router.get("/", authMiddleware, async (req, res) => {
  try {

    const questions = await Question.find()
      .populate("course");

    res.status(200).json({
      message: "Questions fetched successfully",
      questions
    });

  } catch (error) {

    console.error("GET QUESTIONS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// =====================================================
// GET QUESTIONS FOR A COURSE
// GET /api/questions/course/:courseId
// =====================================================

router.get("/course/:courseId", authMiddleware, async (req, res) => {
  try {

    const questions = await Question.find({
      courseId: req.params.courseId
    });

    res.status(200).json({
      message: "Course questions fetched successfully",
      questions
    });

  } catch (error) {

    console.error("COURSE QUESTIONS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


module.exports = router;