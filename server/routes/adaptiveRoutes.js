const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const generateAdaptiveAnalysis = require("../services/adaptiveEngine");

const router = express.Router();

// GET ADAPTIVE LEARNING ANALYSIS
router.get("/analysis", authMiddleware, async (req, res) => {
  try {
    const analysis = await generateAdaptiveAnalysis(req.user.id);

    res.status(200).json({
      message: "Adaptive learning analysis generated successfully",
      analysis
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to generate adaptive analysis"
    });
  }
});

module.exports = router;