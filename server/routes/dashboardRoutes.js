const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");

const router = express.Router();

// STUDENT DASHBOARD
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const profile = await StudentProfile.findOne({
      user: req.user.id
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Student dashboard loaded successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },

      profile: profile || null
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;