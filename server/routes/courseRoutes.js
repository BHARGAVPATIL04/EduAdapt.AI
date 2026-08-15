const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

// CREATE COURSE
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      duration,
      skills
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Title, description and category are required"
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      difficulty,
      duration,
      skills
    });

    res.status(201).json({
      message: "Course created successfully",
      course
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// GET ALL COURSES
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();

    res.status(200).json({
      message: "Courses fetched successfully",
      courses
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;