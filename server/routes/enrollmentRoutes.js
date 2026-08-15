const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ENROLL IN A COURSE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required"
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "Already enrolled in this course"
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId
    });

    res.status(201).json({
      message: "Course enrollment successful",
      enrollment
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// GET MY ENROLLED COURSES
router.get("/", authMiddleware, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user.id
    }).populate("course");

    res.status(200).json({
      message: "Enrollments fetched successfully",
      enrollments
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


module.exports = router;