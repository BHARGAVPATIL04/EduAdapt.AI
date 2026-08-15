const express = require("express");
const StudentProfile = require("../models/StudentProfile");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE / UPDATE STUDENT PROFILE
router.post("/profile", authMiddleware, async (req, res) => {
  try {
    const {
      educationLevel,
      branch,
      semester,
      subjects,
      interests,
      learningGoals,
      preferredLearningStyle
    } = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        educationLevel,
        branch,
        semester,
        subjects,
        interests,
        learningGoals,
        preferredLearningStyle
      },
      {
        new: true,
        upsert: true
      }
    );

    res.status(200).json({
      message: "Student profile saved successfully",
      profile
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

// GET STUDENT PROFILE
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      user: req.user.id
    });

    if (!profile) {
      return res.status(404).json({
        message: "Student profile not found"
      });
    }

    res.status(200).json({
      message: "Student profile fetched successfully",
      profile
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// GET STUDENT PROFILE
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      user: req.user.id
    });

    if (!profile) {
      return res.status(404).json({
        message: "Student profile not found"
      });
    }

    res.status(200).json({
      profile
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


module.exports = router;